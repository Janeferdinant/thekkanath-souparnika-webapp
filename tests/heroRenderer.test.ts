import { describe, it, expect, vi } from 'vitest';
import { assessFrameTimes } from '../src/glass/renderer/frameBudget';
import { toLensUniforms } from '../src/glass/renderer/lensUniforms';
import { createHeroRenderer } from '../src/glass/renderer/webgl';

const rect = (x: number, y: number, w: number, h: number) =>
  ({ left: x, top: y, width: w, height: h, right: x + w, bottom: y + h, x, y, toJSON: () => ({}) }) as DOMRect;

describe('assessFrameTimes', () => {
  it('needs at least 12 samples before judging', () => {
    expect(assessFrameTimes(Array(11).fill(100))).toBe('insufficient');
  });
  it('is ok when the median frame time is 24ms or less', () => {
    expect(assessFrameTimes(Array(20).fill(16))).toBe('ok');
    expect(assessFrameTimes(Array(20).fill(24))).toBe('ok');
  });
  it('is slow when the median is over 24ms, even with a few fast outliers', () => {
    expect(assessFrameTimes(Array(20).fill(30))).toBe('slow');
    expect(assessFrameTimes([5, 5, 5, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40])).toBe('slow');
  });
  it('is not fooled by one long hitch', () => {
    expect(assessFrameTimes([16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 400])).toBe('ok');
  });
});

describe('toLensUniforms', () => {
  const frame = rect(100, 50, 600, 400);

  it('packs device-pixel rects with a bottom-left origin', () => {
    // lens at frame top-left offset (10, 10), 100x50, frame height 400, dpr 2
    const out = toLensUniforms([rect(110, 60, 100, 50)], frame, 2);
    expect([...out.slice(0, 4)]).toEqual([20, (400 - 10 - 50) * 2, 200, 100]);
    expect(out[3]).toBe(100);
    expect(out.length).toBe(5);
  });

  it('drops a lens that is entirely outside the frame', () => {
    expect(toLensUniforms([rect(900, 900, 100, 50)], frame, 1).length).toBe(0);
    expect(toLensUniforms([rect(0, 0, 50, 20)], frame, 1).length).toBe(0);
  });

  it('clips a lens that overhangs the frame edge', () => {
    // a nav bar starting above the frame: only the part inside the frame counts
    const out = toLensUniforms([rect(0, 0, 800, 120)], frame, 1);
    expect([...out.slice(0, 4)]).toEqual([0, 400 - 70, 600, 70]);
  });

  it('ignores lenses beyond the maximum', () => {
    const lenses = Array.from({ length: 6 }, (_, i) => rect(110 + i, 60, 20, 20));
    expect(toLensUniforms(lenses, frame, 1).length).toBe(4 * 5);
    expect(toLensUniforms(lenses, frame, 1, 2).length).toBe(2 * 5);
  });

  it('carries a lens radius when the element supplies one', () => {
    const lens = Object.assign(rect(110, 60, 100, 50), { radius: 16 });
    expect(toLensUniforms([lens], frame, 2)[4]).toBe(32);
  });
});

// ---------------------------------------------------------------------------------------------
// A stand-in WebGL context: every method is a counting no-op unless overridden.
const makeGl = (overrides: Record<string, unknown> = {}) => {
  const calls: Record<string, number> = {};
  const loseContext = vi.fn();
  const gl = new Proxy(
    {},
    {
      get: (_t, key: string) => {
        if (key in overrides) return overrides[key];
        if (key === 'getExtension') return () => ({ loseContext });
        return (..._args: unknown[]) => {
          calls[key] = (calls[key] ?? 0) + 1;
          return {};
        };
      },
    },
  ) as unknown as WebGLRenderingContext;
  return { gl, calls, loseContext };
};

const makeCanvas = (gl: unknown) => {
  const canvas = document.createElement('canvas');
  canvas.getContext = vi.fn(() => gl) as unknown as typeof canvas.getContext;
  return canvas;
};

describe('createHeroRenderer', () => {
  const image = document.createElement('img');

  it('returns null and reports no-webgl when the context cannot be created', () => {
    const onFailure = vi.fn();
    const renderer = createHeroRenderer(makeCanvas(null), image, { dpr: 1, onFailure });
    expect(renderer).toBeNull();
    expect(onFailure).toHaveBeenCalledWith('no-webgl');
  });

  it('returns null and reports shader-compile when a shader does not compile', () => {
    const onFailure = vi.fn();
    const { gl } = makeGl({ getShaderParameter: () => false, getShaderInfoLog: () => 'bad' });
    expect(createHeroRenderer(makeCanvas(gl), image, { dpr: 1, onFailure })).toBeNull();
    expect(onFailure).toHaveBeenCalledWith('shader-compile');
  });

  it('returns null and reports program-link when linking fails', () => {
    const onFailure = vi.fn();
    const { gl } = makeGl({ getProgramParameter: () => false, getProgramInfoLog: () => 'bad' });
    expect(createHeroRenderer(makeCanvas(gl), image, { dpr: 1, onFailure })).toBeNull();
    expect(onFailure).toHaveBeenCalledWith('program-link');
  });

  it('releases the texture, buffer and program exactly once on destroy, and loses the context', () => {
    const { gl, calls, loseContext } = makeGl();
    const renderer = createHeroRenderer(makeCanvas(gl), image, { dpr: 1, onFailure: vi.fn() })!;
    expect(renderer).not.toBeNull();
    renderer.destroy();
    expect(calls.deleteTexture).toBe(1);
    expect(calls.deleteBuffer).toBe(1);
    expect(calls.deleteProgram).toBe(1);
    expect(loseContext).toHaveBeenCalledTimes(1);
    renderer.destroy();
    expect(calls.deleteTexture).toBe(1);
  });

  it('draws a single full-screen pass per render call, and nothing after destroy', () => {
    const { gl, calls } = makeGl();
    const renderer = createHeroRenderer(makeCanvas(gl), image, { dpr: 1, onFailure: vi.fn() })!;
    renderer.resize(300, 400);
    renderer.render(new Float32Array(0), [0.5, 0.5]);
    expect(calls.drawArrays).toBe(1);
    renderer.destroy();
    renderer.render(new Float32Array(0), [0.5, 0.5]);
    expect(calls.drawArrays).toBe(1);
  });

  it('hides the canvas and stops drawing when the context is lost, and recovers on restore', () => {
    const { gl, calls } = makeGl();
    const canvas = makeCanvas(gl);
    const renderer = createHeroRenderer(canvas, image, { dpr: 1, onFailure: vi.fn() })!;
    renderer.resize(300, 400);

    const lost = new Event('webglcontextlost', { cancelable: true });
    canvas.dispatchEvent(lost);
    expect(lost.defaultPrevented).toBe(true);
    expect(canvas.style.visibility).toBe('hidden');

    renderer.render(new Float32Array(0), [0.5, 0.5]);
    expect(calls.drawArrays ?? 0).toBe(0);

    canvas.dispatchEvent(new Event('webglcontextrestored'));
    expect(canvas.style.visibility).toBe('visible');
    expect(calls.createProgram).toBe(2); // resources were re-created
    renderer.render(new Float32Array(0), [0.5, 0.5]);
    expect(calls.drawArrays).toBe(1);
  });

  it('removes its canvas listeners on destroy', () => {
    const { gl } = makeGl();
    const canvas = makeCanvas(gl);
    const removeSpy = vi.spyOn(canvas, 'removeEventListener');
    createHeroRenderer(canvas, image, { dpr: 1, onFailure: vi.fn() })!.destroy();
    const removed = removeSpy.mock.calls.map(([type]) => type);
    expect(removed).toContain('webglcontextlost');
    expect(removed).toContain('webglcontextrestored');
  });
});
