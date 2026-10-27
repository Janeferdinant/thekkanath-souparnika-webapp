import { describe, it, expect, vi, afterEach, beforeAll, beforeEach } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HeroSection } from '../src/components/public/HeroSection';
import { GlassContext, GlassPerformanceManager } from '../src/glass/GlassPerformanceManager';
import type { GlassEnvironment } from '../src/glass/capabilities';

const rect = (x: number, y: number, w: number, h: number) =>
  ({ left: x, top: y, width: w, height: h, right: x + w, bottom: y + h, x, y, toJSON: () => ({}) }) as DOMRect;

// HeroRefraction inside HeroSection, with the WebGL layer replaced by a recording fake.
// (Kept apart from heroRenderer.test.ts because vi.mock replaces the module for the whole file.), with the WebGL layer replaced by a recording fake.
const fakeRenderer = { render: vi.fn(), resize: vi.fn(), destroy: vi.fn() };
const createSpy = vi.fn((..._args: unknown[]) => fakeRenderer);
vi.mock('../src/glass/renderer/webgl', () => ({
  createHeroRenderer: (...args: unknown[]) => createSpy(...args),
}));

const ENHANCED: GlassEnvironment = {
  override: null,
  supportsBackdropFilter: true,
  webgl: true,
  reducedMotion: false,
  saveData: false,
  effectiveType: '4g',
  deviceMemory: 8,
  hardwareConcurrency: 8,
  sessionDowngrade: null,
};

// Load the lazily imported renderer chunk once up front, so "it was not mounted" assertions below can
// only mean the component chose not to mount it, not that the chunk was still being fetched.
beforeAll(async () => {
  await import('../src/glass/renderer/HeroRefraction');
});

let rafQueue: FrameRequestCallback[] = [];
let resizeCallbacks: ResizeObserverCallback[] = [];

beforeEach(() => {
  rafQueue = [];
  resizeCallbacks = [];
  fakeRenderer.render.mockClear();
  fakeRenderer.resize.mockClear();
  fakeRenderer.destroy.mockClear();
  createSpy.mockClear();
  createSpy.mockImplementation(() => fakeRenderer);
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    rafQueue.push(cb);
    return rafQueue.length;
  });
  vi.stubGlobal('cancelAnimationFrame', () => undefined);
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(cb: ResizeObserverCallback) {
        resizeCallbacks.push(cb);
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(private cb: IntersectionObserverCallback) {}
      observe(el: Element) {
        this.cb([{ isIntersecting: true, target: el } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
      }
      unobserve() {}
      disconnect() {}
    },
  );
  Object.defineProperty(window, 'devicePixelRatio', { value: 3, configurable: true });
  Object.defineProperty(window, 'innerWidth', { value: 1440, configurable: true });
  Object.defineProperty(window, 'requestIdleCallback', { value: undefined, configurable: true });
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'], shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const flushFrames = (timestamps: number[]) => {
  for (const t of timestamps) {
    const queued = rafQueue;
    rafQueue = [];
    queued.forEach((cb) => cb(t));
  }
};

const renderHero = (downgrade = vi.fn(), tier: 'enhanced' | 'lite' = 'enhanced') => {
  const utils = render(
    <MemoryRouter>
      <GlassContext.Provider value={{ tier, reasons: [], pageVisible: true, downgrade, reportReason: vi.fn() }}>
        <HeroSection />
      </GlassContext.Provider>
    </MemoryRouter>,
  );
  const frame = utils.container.querySelector('[data-hero-frame]') as HTMLElement;
  frame.getBoundingClientRect = () => rect(0, 0, 600, 800);
  const img = frame.querySelector('img') as HTMLImageElement;
  Object.defineProperty(img, 'naturalWidth', { value: 1086, configurable: true });
  return { ...utils, frame, img, downgrade };
};

/** Advances fake time, then gives the lazily imported renderer chunk real time to resolve. */
const settle = async (ms: number) => {
  await act(async () => {
    vi.advanceTimersByTime(ms);
    await new Promise((resolve) => setTimeout(resolve, 80));
  });
};

const mountRenderer = async (ctx: ReturnType<typeof renderHero>) => {
  fireEvent.load(ctx.img);
  await act(async () => {
    vi.advanceTimersByTime(250);
  });
  await waitFor(() => expect(createSpy).toHaveBeenCalled());
};

describe('HeroRefraction mounting', () => {
  it('never mounts on lite or fallback tiers', async () => {
    const ctx = renderHero(vi.fn(), 'lite');
    fireEvent.load(ctx.img);
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(createSpy).not.toHaveBeenCalled();
    expect(ctx.frame.querySelector('canvas')).toBeNull();
  });

  it('does not mount until the photo has loaded', async () => {
    const ctx = renderHero();
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(createSpy).not.toHaveBeenCalled();
    expect(ctx.frame.querySelector('canvas')).toBeNull();
  });

  it('waits for the window load event before starting, so it never competes with page load', async () => {
    const original = Object.getOwnPropertyDescriptor(document, 'readyState');
    Object.defineProperty(document, 'readyState', { value: 'loading', configurable: true });
    try {
      const ctx = renderHero();
      fireEvent.load(ctx.img);
      await settle(3000);
      expect(createSpy).not.toHaveBeenCalled();

      Object.defineProperty(document, 'readyState', { value: 'complete', configurable: true });
      await act(async () => {
        window.dispatchEvent(new Event('load'));
      });
      await settle(250);
      await waitFor(() => expect(createSpy).toHaveBeenCalled());
    } finally {
      if (original) Object.defineProperty(document, 'readyState', original);
      else delete (document as unknown as Record<string, unknown>).readyState;
    }
  });

  it('does not start if the page is left before load completes', async () => {
    const original = Object.getOwnPropertyDescriptor(document, 'readyState');
    Object.defineProperty(document, 'readyState', { value: 'loading', configurable: true });
    try {
      const ctx = renderHero();
      fireEvent.load(ctx.img);
      ctx.unmount();
      await act(async () => {
        window.dispatchEvent(new Event('load'));
      });
      await settle(1000);
      expect(createSpy).not.toHaveBeenCalled();
    } finally {
      if (original) Object.defineProperty(document, 'readyState', original);
      else delete (document as unknown as Record<string, unknown>).readyState;
    }
  });

  it('leaves no canvas when the hero image errors (slow or failed image)', async () => {
    const ctx = renderHero();
    fireEvent.error(ctx.img);
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(createSpy).not.toHaveBeenCalled();
    expect(ctx.frame.querySelector('canvas')).toBeNull();
  });

  it('keeps the phone text scrim and the info panel above the canvas, so text never sits on raw photo', async () => {
    const ctx = renderHero();
    await mountRenderer(ctx);
    const canvas = ctx.frame.querySelector('canvas') as HTMLCanvasElement;
    const canvasZ = Number(canvas.style.zIndex);
    const zOf = (el: Element) => Number(/(?:^|\s)(?:md:|lg:)?z-\[?(\d+)\]?(?:\s|$)/.exec(el.className)?.[1] ?? 0);
    const scrim = ctx.frame.querySelector('[data-hero-scrim]')!;
    expect(scrim).not.toBeNull();
    expect(zOf(scrim)).toBeGreaterThan(canvasZ);
    const panel = ctx.frame.querySelector('[data-glass-lens]')!;
    expect(zOf(panel)).toBeGreaterThan(zOf(scrim));
  });

  it('mounts a decorative canvas inside the frame once the photo has loaded and the browser is idle', async () => {
    const ctx = renderHero();
    await mountRenderer(ctx);
    const canvas = ctx.frame.querySelector('canvas')!;
    expect(canvas).not.toBeNull();
    expect(canvas.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('HeroRefraction sizing', () => {
  it('sizes the canvas to the frame times the capped device pixel ratio (2 on desktop)', async () => {
    const ctx = renderHero();
    await mountRenderer(ctx);
    expect(createSpy.mock.calls[0][2]).toMatchObject({ dpr: 2 });
    expect(fakeRenderer.resize).toHaveBeenCalledWith(1200, 1600);
  });

  it('caps the pixel ratio at 1.5 on phones', async () => {
    Object.defineProperty(window, 'innerWidth', { value: 390, configurable: true });
    const ctx = renderHero();
    await mountRenderer(ctx);
    expect(createSpy.mock.calls[0][2]).toMatchObject({ dpr: 1.5 });
    expect(fakeRenderer.resize).toHaveBeenCalledWith(900, 1200);
  });

  it('follows the frame when it resizes, so the photo is never stretched', async () => {
    const ctx = renderHero();
    await mountRenderer(ctx);
    fakeRenderer.resize.mockClear();
    ctx.frame.getBoundingClientRect = () => rect(0, 0, 300, 400);
    act(() => resizeCallbacks.forEach((cb) => cb([], {} as ResizeObserver)));
    expect(fakeRenderer.resize).toHaveBeenCalledWith(600, 800);
  });
});

describe('HeroRefraction rendering budget', () => {
  it('renders on demand: after the first frames settle there is no render loop', async () => {
    const ctx = renderHero();
    await mountRenderer(ctx);
    // 12 frames at 16ms ends the one-off measurement
    flushFrames(Array.from({ length: 14 }, (_, i) => 1000 + i * 16));
    const settled = fakeRenderer.render.mock.calls.length;
    expect(settled).toBeGreaterThan(0);
    expect(rafQueue.length).toBe(0);
    flushFrames([2000, 2016, 2032]);
    await act(async () => {
      vi.advanceTimersByTime(5000);
    });
    expect(fakeRenderer.render.mock.calls.length).toBe(settled);
    expect(ctx.downgrade).not.toHaveBeenCalled();
  });

  it('downgrades to lite once, and unmounts, when the first frames are too slow', async () => {
    const downgrade = vi.fn();
    const ctx = renderHero(downgrade);
    await mountRenderer(ctx);
    flushFrames(Array.from({ length: 16 }, (_, i) => 1000 + i * 40));
    expect(downgrade).toHaveBeenCalledTimes(1);
    expect(downgrade).toHaveBeenCalledWith('lite', 'frame-budget');
  });

  it('re-renders when a lens is registered or removed', async () => {
    const { registerLens } = await import('../src/glass/lensRegistry');
    const ctx = renderHero();
    await mountRenderer(ctx);
    flushFrames(Array.from({ length: 14 }, (_, i) => 1000 + i * 16));
    const before = fakeRenderer.render.mock.calls.length;
    const el = document.createElement('div');
    el.getBoundingClientRect = () => rect(20, 20, 100, 50);
    let release = () => {};
    act(() => {
      release = registerLens(el);
    });
    flushFrames([3000]);
    expect(fakeRenderer.render.mock.calls.length).toBeGreaterThan(before);
    const lensArg = fakeRenderer.render.mock.calls.at(-1)![0] as Float32Array;
    expect(lensArg.length).toBe(5);
    act(() => release());
  });

  it('marks lenses as refracting only while the renderer is live, and unmarks them on unmount', async () => {
    const { registerLens } = await import('../src/glass/lensRegistry');
    const ctx = renderHero();
    const el = document.createElement('div');
    el.getBoundingClientRect = () => rect(20, 20, 100, 50);
    const release = registerLens(el);
    await mountRenderer(ctx);
    flushFrames([1000, 1016]);
    expect(el.hasAttribute('data-glass-refracting')).toBe(true);
    ctx.unmount();
    expect(el.hasAttribute('data-glass-refracting')).toBe(false);
    expect(fakeRenderer.destroy).toHaveBeenCalledTimes(1);
    release();
  });

  it('does not render while the page is hidden', async () => {
    const ctx = renderHero();
    await mountRenderer(ctx);
    flushFrames(Array.from({ length: 14 }, (_, i) => 1000 + i * 16));
    const before = fakeRenderer.render.mock.calls.length;
    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    flushFrames([4000]);
    expect(fakeRenderer.render.mock.calls.length).toBe(before);
    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
  });
});

describe('HeroRefraction failure handling', () => {
  it('keeps the DOM photo and removes the canvas when the renderer cannot start', async () => {
    createSpy.mockImplementation((...args: unknown[]) => {
      (args[2] as { onFailure: (r: string) => void }).onFailure('shader-compile');
      return null as never;
    });
    const downgrade = vi.fn();
    const ctx = renderHero(downgrade);
    await mountRenderer(ctx);
    expect(downgrade).toHaveBeenCalledWith('lite', 'shader-compile');
    await waitFor(() => expect(ctx.frame.querySelector('canvas')).toBeNull());
    expect(ctx.frame.querySelector('img')).not.toBeNull();
  });
});

describe('with the real provider', () => {
  it('HeroSection under GlassPerformanceManager on an enhanced device mounts the renderer', async () => {
    const utils = render(
      <MemoryRouter>
        <GlassPerformanceManager env={ENHANCED}>
          <HeroSection />
        </GlassPerformanceManager>
      </MemoryRouter>,
    );
    const frame = utils.container.querySelector('[data-hero-frame]') as HTMLElement;
    frame.getBoundingClientRect = () => rect(0, 0, 600, 800);
    const img = frame.querySelector('img') as HTMLImageElement;
    Object.defineProperty(img, 'naturalWidth', { value: 1086, configurable: true });
    fireEvent.load(img);
    await act(async () => {
      vi.advanceTimersByTime(250);
    });
    await waitFor(() => expect(createSpy).toHaveBeenCalled());
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Thekkanath Souparnika');
  });
});
