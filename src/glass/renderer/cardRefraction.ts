import { buildProgram, createPhotoTexture, createQuadBuffer, drawFrame, lookupUniforms, type UniformLocations } from './webgl';
import { emitCardRendererDisabled, onCardRendererDisabled, resetCardRendererListeners } from './cardEvents';

export { onCardRendererDisabled };

/** Where the overlay sits inside the photo it refracts, in device pixels. */
export interface CardArea {
  /** Size of the whole photo area the lens position is measured in. */
  width: number;
  height: number;
  /** Top-left of the overlay inside that area. */
  cropX: number;
  cropY: number;
}

export interface CardRenderer {
  /** True once the render-time budget was exceeded; overlays then keep their plain CSS look. */
  readonly disabled: boolean;
  /**
   * Renders `image` with refraction inside `lenses` into the shared WebGL canvas, then copies the
   * overlay's region of the result into `target` (a 2D canvas under the overlay).
   */
  renderTo(target: HTMLCanvasElement, image: HTMLImageElement, lenses: Float32Array, area?: CardArea): void;
}

const MAX_TEXTURES = 8;
const BUDGET_SAMPLES = 8;
const BUDGET_MEDIAN_MS = 8;
/** Small chips need a much tighter bevel than the hero panel, so the lens effect is scaled down. */
const CARD_LENS_SCALE = 0.5;

let instance: (CardRenderer & { dispose(): void }) | null | undefined;

const renderDpr = () => Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.5 : 2);

function create(): (CardRenderer & { dispose(): void }) | null {
  // One detached canvas and one context serve every card on the page, however many there are.
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, preserveDrawingBuffer: false }) as WebGLRenderingContext | null;
  if (!gl) return null;

  let program: WebGLProgram | null = null;
  let buffer: WebGLBuffer | null = null;
  let uniforms: UniformLocations = {};
  const textures = new Map<string, WebGLTexture>(); // insertion order = least to most recently used
  let lost = false;
  let disabled = false;
  const durations: number[] = [];

  const init = (): boolean => {
    const built = buildProgram(gl);
    if ('failure' in built) return false;
    const quad = createQuadBuffer(gl);
    if (!quad) {
      gl.deleteProgram(built.program);
      return false;
    }
    program = built.program;
    buffer = quad;
    uniforms = lookupUniforms(gl, built.program);
    return true;
  };

  if (!init()) return null;

  const releaseTextures = () => {
    textures.forEach((t) => gl.deleteTexture(t));
    textures.clear();
  };

  const releaseAll = () => {
    releaseTextures();
    if (buffer) gl.deleteBuffer(buffer);
    if (program) gl.deleteProgram(program);
    buffer = null;
    program = null;
  };

  const textureFor = (image: HTMLImageElement): WebGLTexture | null => {
    const key = image.currentSrc || image.src;
    const cached = textures.get(key);
    if (cached) {
      textures.delete(key); // refresh its place as most recently used
      textures.set(key, cached);
      return cached;
    }
    const texture = createPhotoTexture(gl, image);
    if (!texture) return null;
    textures.set(key, texture);
    if (textures.size > MAX_TEXTURES) {
      const oldest = textures.keys().next().value as string;
      gl.deleteTexture(textures.get(oldest)!);
      textures.delete(oldest);
    }
    return texture;
  };

  const record = (ms: number) => {
    if (durations.length >= BUDGET_SAMPLES) return;
    durations.push(ms);
    if (durations.length < BUDGET_SAMPLES) return;
    const sorted = [...durations].sort((a, b) => a - b);
    if (sorted[Math.floor(sorted.length / 2)] > BUDGET_MEDIAN_MS) {
      disabled = true;
      releaseAll();
      emitCardRendererDisabled();
    }
  };

  const onLost = (event: Event) => {
    event.preventDefault();
    lost = true;
    textures.clear(); // the objects died with the context
  };
  const onRestored = () => {
    program = null;
    buffer = null;
    lost = !init();
  };
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);

  return {
    get disabled() {
      return disabled;
    },

    renderTo(target, image, lenses, areaIn) {
      if (disabled || lost || !program || !buffer) return;
      const started = performance.now();

      const ctx = target.getContext('2d');
      const texture = textureFor(image);
      if (!ctx || !texture) return;

      const area = areaIn ?? { width: target.width, height: target.height, cropX: 0, cropY: 0 };
      if (canvas.width !== area.width || canvas.height !== area.height) {
        canvas.width = area.width;
        canvas.height = area.height;
      }

      drawFrame(gl, { program, buffer, texture, uniforms }, {
        width: area.width,
        height: area.height,
        image,
        dpr: CARD_LENS_SCALE * renderDpr(),
        lenses,
        light: [area.width * 0.3, area.height * 0.85],
      });

      ctx.clearRect(0, 0, target.width, target.height);
      // the GL canvas measures y from the bottom, the overlay's position was measured from the top
      ctx.drawImage(canvas, area.cropX, area.height - (area.cropY + target.height), target.width, target.height, 0, 0, target.width, target.height);

      record(performance.now() - started);
    },

    dispose() {
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      releaseAll();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}

/** The one shared card renderer, created on first use. Null if WebGL is unavailable or over budget. */
export function getCardRenderer(): CardRenderer | null {
  if (instance === undefined) instance = create();
  return instance && !instance.disabled ? instance : null;
}

/** Releases the shared context and forgets it (tests, and teardown). */
export function resetCardRenderer(): void {
  instance?.dispose();
  instance = undefined;
  resetCardRendererListeners();
}
