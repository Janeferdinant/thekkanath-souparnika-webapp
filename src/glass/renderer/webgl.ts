import { FRAGMENT_SHADER, VERTEX_SHADER } from './shaders';
import { FLOATS_PER_LENS, MAX_LENSES } from './lensUniforms';

export interface HeroRenderer {
  /** Draws one frame. `light` is the pointer position over the frame, 0 to 1, top-left origin. */
  render(lenses: Float32Array, light: [number, number]): void;
  /** Sets the canvas backing size in device pixels. */
  resize(width: number, height: number): void;
  /** Releases every GPU object and listener. Safe to call twice. */
  destroy(): void;
}

interface HeroRendererOptions {
  dpr: number;
  onFailure(reason: string): void;
}

export type UniformLocations = Record<string, WebGLUniformLocation | null>;

const UNIFORMS = ['u_img', 'u_res', 'u_imgSize', 'u_light', 'u_dpr', 'u_count', 'u_rect', 'u_radius'] as const;

const compile = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

/** Compiles and links the lens program. Returns a failure reason instead of throwing. */
export function buildProgram(gl: WebGLRenderingContext): { program: WebGLProgram } | { failure: string } {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vertex || !fragment) {
    if (vertex) gl.deleteShader(vertex);
    if (fragment) gl.deleteShader(fragment);
    return { failure: 'shader-compile' };
  }

  const program = gl.createProgram();
  if (!program) return { failure: 'program-link' };
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return { failure: 'program-link' };
  }
  return { program };
}

export function lookupUniforms(gl: WebGLRenderingContext, program: WebGLProgram): UniformLocations {
  const uniforms: UniformLocations = {};
  for (const name of UNIFORMS) uniforms[name] = gl.getUniformLocation(program, name);
  return uniforms;
}

/** Creates the full-screen quad buffer. */
export function createQuadBuffer(gl: WebGLRenderingContext): WebGLBuffer | null {
  const buffer = gl.createBuffer();
  if (!buffer) return null;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  return buffer;
}

/** Creates a texture from a loaded image. Returns null if the browser refuses the upload. */
export function createPhotoTexture(gl: WebGLRenderingContext, image: HTMLImageElement): WebGLTexture | null {
  const texture = gl.createTexture();
  if (!texture) return null;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  try {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  } catch {
    gl.deleteTexture(texture);
    return null;
  }
  return texture;
}

export interface FrameParams {
  /** Backing size of the GL canvas, device px. */
  width: number;
  height: number;
  image: HTMLImageElement;
  dpr: number;
  lenses: Float32Array;
  /** Light position in device px, bottom-left origin. */
  light: [number, number];
}

/** Draws one full-screen pass with the lens program. */
export function drawFrame(
  gl: WebGLRenderingContext,
  res: { program: WebGLProgram; buffer: WebGLBuffer; texture: WebGLTexture; uniforms: UniformLocations },
  p: FrameParams,
): void {
  const { program, buffer, texture, uniforms } = res;

  const count = Math.min(Math.floor(p.lenses.length / FLOATS_PER_LENS), MAX_LENSES);
  const rects = new Float32Array(MAX_LENSES * 4);
  const radii = new Float32Array(MAX_LENSES);
  for (let i = 0; i < count; i++) {
    const o = i * FLOATS_PER_LENS;
    rects.set(p.lenses.subarray(o, o + 4), i * 4);
    radii[i] = p.lenses[o + 4];
  }

  gl.viewport(0, 0, p.width, p.height);
  gl.useProgram(program);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  const position = gl.getAttribLocation(program, 'a_pos');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(uniforms.u_img, 0);
  gl.uniform2f(uniforms.u_res, p.width, p.height);
  gl.uniform2f(uniforms.u_imgSize, p.image.naturalWidth || p.width, p.image.naturalHeight || p.height);
  gl.uniform2f(uniforms.u_light, p.light[0], p.light[1]);
  gl.uniform1f(uniforms.u_dpr, p.dpr);
  gl.uniform1f(uniforms.u_count, count);
  gl.uniform4fv(uniforms.u_rect, rects);
  gl.uniform1fv(uniforms.u_radius, radii);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

interface Resources {
  program: WebGLProgram;
  buffer: WebGLBuffer;
  texture: WebGLTexture;
  uniforms: UniformLocations;
}

/**
 * Hand-written WebGL 1 renderer for the hero photo. It never loops by itself: the caller decides
 * when a frame is needed. Returns null (after calling `onFailure`) if the context, a shader, the
 * program or the texture cannot be created. Handles context loss and restore.
 */
export function createHeroRenderer(canvas: HTMLCanvasElement, image: HTMLImageElement, opts: HeroRendererOptions): HeroRenderer | null {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, preserveDrawingBuffer: false }) as WebGLRenderingContext | null;
  if (!gl) {
    opts.onFailure('no-webgl');
    return null;
  }

  let resources: Resources | null = null;
  let lost = false;
  let destroyed = false;
  let size: [number, number] | null = null;
  let last: { lenses: Float32Array; light: [number, number] } | null = null;

  /** Creates the program, quad buffer and photo texture. Returns a failure reason, or null on success. */
  const init = (): string | null => {
    const built = buildProgram(gl);
    if ('failure' in built) return built.failure;

    const buffer = createQuadBuffer(gl);
    if (!buffer) {
      gl.deleteProgram(built.program);
      return 'resource-alloc';
    }
    const texture = createPhotoTexture(gl, image);
    if (!texture) {
      gl.deleteProgram(built.program);
      gl.deleteBuffer(buffer);
      return 'texture-upload';
    }

    resources = { program: built.program, buffer, texture, uniforms: lookupUniforms(gl, built.program) };
    return null;
  };

  const release = () => {
    if (!resources) return;
    gl.deleteTexture(resources.texture);
    gl.deleteBuffer(resources.buffer);
    gl.deleteProgram(resources.program);
    resources = null;
  };

  const draw = (lenses: Float32Array, light: [number, number]) => {
    if (!resources || !size) return;
    const [width, height] = size;
    drawFrame(gl, resources, {
      width,
      height,
      image,
      dpr: opts.dpr,
      lenses,
      light: [light[0] * width, (1 - light[1]) * height],
    });
  };

  const onLost = (event: Event) => {
    event.preventDefault(); // allows the browser to restore the context
    lost = true;
    canvas.style.visibility = 'hidden';
  };

  const onRestored = () => {
    lost = false;
    resources = null; // the old objects died with the context
    const failure = init();
    if (failure) {
      opts.onFailure(failure);
      return;
    }
    canvas.style.visibility = 'visible';
    if (last) draw(last.lenses, last.light);
  };

  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);

  const failure = init();
  if (failure) {
    canvas.removeEventListener('webglcontextlost', onLost);
    canvas.removeEventListener('webglcontextrestored', onRestored);
    opts.onFailure(failure);
    return null;
  }

  return {
    render(lenses, light) {
      if (destroyed || lost) return;
      last = { lenses, light };
      draw(lenses, light);
    },
    resize(width, height) {
      size = [width, height];
      canvas.width = width;
      canvas.height = height;
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      release();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}
