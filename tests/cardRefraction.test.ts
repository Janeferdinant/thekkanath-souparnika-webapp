import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getCardRenderer, onCardRendererDisabled, resetCardRenderer } from '../src/glass/renderer/cardRefraction';

const calls: Record<string, number> = {};
const drawImage = vi.fn();

// A stand-in WebGL context: every method is a counting no-op.
const gl = new Proxy(
  {},
  {
    get: (_t, key: string) => {
      if (key === 'getExtension') return () => ({ loseContext: vi.fn() });
      return () => {
        calls[key] = (calls[key] ?? 0) + 1;
        return {};
      };
    },
  },
);

const originalGetContext = HTMLCanvasElement.prototype.getContext;
let webglAvailable = true;
let sharedCanvas: HTMLCanvasElement | null = null;

beforeEach(() => {
  for (const k of Object.keys(calls)) delete calls[k];
  drawImage.mockClear();
  webglAvailable = true;
  sharedCanvas = null;
  HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string) {
    if (type === 'webgl') {
      sharedCanvas = this;
      return webglAvailable ? gl : null;
    }
    if (type === '2d') return { drawImage, clearRect: vi.fn() };
    return null;
  } as unknown as typeof HTMLCanvasElement.prototype.getContext;
});

afterEach(() => {
  resetCardRenderer();
  HTMLCanvasElement.prototype.getContext = originalGetContext;
  vi.restoreAllMocks();
});

const photo = (src: string) => {
  const img = document.createElement('img');
  Object.defineProperty(img, 'currentSrc', { value: src });
  Object.defineProperty(img, 'naturalWidth', { value: 640 });
  Object.defineProperty(img, 'naturalHeight', { value: 320 });
  return img;
};

const target = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 120;
  canvas.height = 40;
  return canvas;
};

const LENS = Float32Array.of(0, 0, 120, 40, 20);
const AREA = { width: 640, height: 320, cropX: 10, cropY: 10 };

/** Makes every performance.now() call advance by `step` ms, so each render appears to take `step` ms. */
const mockClock = (step: number) => {
  let t = 0;
  vi.spyOn(performance, 'now').mockImplementation(() => (t += step));
};

describe('getCardRenderer', () => {
  it('returns the same instance every time (one shared WebGL context)', () => {
    const first = getCardRenderer();
    expect(first).not.toBeNull();
    expect(getCardRenderer()).toBe(first);
    expect(calls.createProgram).toBe(1);
  });

  it('returns null when WebGL is unavailable', () => {
    webglAvailable = false;
    expect(getCardRenderer()).toBeNull();
  });

  it('renders into the shared canvas and copies the cropped region to the target canvas', () => {
    const renderer = getCardRenderer()!;
    renderer.renderTo(target(), photo('/a.jpg'), LENS, AREA);
    expect(calls.drawArrays).toBe(1);
    expect(drawImage).toHaveBeenCalledTimes(1);
    const args = drawImage.mock.calls[0];
    // source x/y/w/h on the GL canvas (y is measured from the bottom there), then destination x/y/w/h
    expect(args.slice(1, 9)).toEqual([10, 320 - (10 + 40), 120, 40, 0, 0, 120, 40]);
  });
});

describe('texture cache', () => {
  it('reuses a texture for the same image', () => {
    const renderer = getCardRenderer()!;
    const img = photo('/a.jpg');
    renderer.renderTo(target(), img, LENS, AREA);
    renderer.renderTo(target(), img, LENS, AREA);
    expect(calls.createTexture).toBe(1);
  });

  it('evicts the least recently used texture when the ninth image arrives', () => {
    const renderer = getCardRenderer()!;
    const images = Array.from({ length: 9 }, (_, i) => photo(`/img-${i}.jpg`));
    images.slice(0, 8).forEach((img) => renderer.renderTo(target(), img, LENS, AREA));
    expect(calls.deleteTexture ?? 0).toBe(0);
    renderer.renderTo(target(), images[8], LENS, AREA);
    expect(calls.deleteTexture).toBe(1);
    expect(calls.createTexture).toBe(9);
  });

  it('keeps recently used images: touching the oldest protects it from eviction', () => {
    const renderer = getCardRenderer()!;
    const images = Array.from({ length: 9 }, (_, i) => photo(`/img-${i}.jpg`));
    images.slice(0, 8).forEach((img) => renderer.renderTo(target(), img, LENS, AREA));
    renderer.renderTo(target(), images[0], LENS, AREA); // refresh the oldest
    renderer.renderTo(target(), images[8], LENS, AREA); // evicts image 1, not image 0
    const createdBefore = calls.createTexture;
    renderer.renderTo(target(), images[0], LENS, AREA);
    expect(calls.createTexture).toBe(createdBefore); // still cached
    renderer.renderTo(target(), images[1], LENS, AREA);
    expect(calls.createTexture).toBe(createdBefore + 1); // had to be uploaded again
  });

  it('releases every cached texture on reset', () => {
    const renderer = getCardRenderer()!;
    [photo('/a.jpg'), photo('/b.jpg')].forEach((img) => renderer.renderTo(target(), img, LENS, AREA));
    resetCardRenderer();
    expect(calls.deleteTexture).toBe(2);
    expect(calls.deleteProgram).toBe(1);
  });
});

describe('performance budget gate', () => {
  it('disables itself after 8 renders when the median render takes over 8ms, and tells listeners once', () => {
    mockClock(12); // each renderTo reads the clock twice: 12ms apart
    const listener = vi.fn();
    const stop = onCardRendererDisabled(listener);
    const renderer = getCardRenderer()!;
    const img = photo('/a.jpg');

    for (let i = 0; i < 7; i++) renderer.renderTo(target(), img, LENS, AREA);
    expect(renderer.disabled).toBe(false);
    expect(listener).not.toHaveBeenCalled();

    renderer.renderTo(target(), img, LENS, AREA);
    expect(renderer.disabled).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);

    const drawsBefore = calls.drawArrays;
    renderer.renderTo(target(), img, LENS, AREA);
    expect(calls.drawArrays).toBe(drawsBefore);
    expect(getCardRenderer()).toBeNull();
    stop();
  });

  it('stays enabled when renders are fast', () => {
    mockClock(2);
    const renderer = getCardRenderer()!;
    const img = photo('/a.jpg');
    for (let i = 0; i < 20; i++) renderer.renderTo(target(), img, LENS, AREA);
    expect(renderer.disabled).toBe(false);
    expect(getCardRenderer()).toBe(renderer);
  });

  it('judges the median, so one slow first render does not disable it', () => {
    let t = 0;
    const steps = [30, 3, 3, 3, 3, 3, 3, 3]; // first render slow, the rest fast
    let call = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => {
      const isStart = call % 2 === 0;
      const render = Math.floor(call / 2);
      call += 1;
      if (isStart) return t;
      t += steps[Math.min(render, steps.length - 1)];
      return t;
    });
    const renderer = getCardRenderer()!;
    const img = photo('/a.jpg');
    for (let i = 0; i < 8; i++) renderer.renderTo(target(), img, LENS, AREA);
    expect(renderer.disabled).toBe(false);
  });
});

describe('context loss', () => {
  it('stops drawing while the shared context is lost and carries on after it is restored', () => {
    const renderer = getCardRenderer()!;
    const img = photo('/a.jpg');
    renderer.renderTo(target(), img, LENS, AREA);
    expect(calls.drawArrays).toBe(1);

    // the shared canvas is detached from the page; the browser fires these events on it
    expect(sharedCanvas).not.toBeNull();
    expect(sharedCanvas!.isConnected).toBe(false);
    const lost = new Event('webglcontextlost', { cancelable: true });
    sharedCanvas!.dispatchEvent(lost);
    expect(lost.defaultPrevented).toBe(true);
    renderer.renderTo(target(), img, LENS, AREA);
    expect(calls.drawArrays).toBe(1);

    sharedCanvas!.dispatchEvent(new Event('webglcontextrestored'));
    renderer.renderTo(target(), img, LENS, AREA);
    expect(calls.drawArrays).toBe(2);
    expect(calls.createProgram).toBe(2);
  });
});
