import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { RefractiveOverlay } from '../src/glass/RefractiveOverlay';
import { GlassContext } from '../src/glass/GlassPerformanceManager';
import { emitCardRendererDisabled, resetCardRendererListeners } from '../src/glass/renderer/cardEvents';

const renderTo = vi.fn();
const fakeRenderer = { disabled: false, renderTo };
const getCardRenderer = vi.fn();
let available = true;

// The real card renderer is a lazily loaded chunk; here it is replaced by a recording fake.
vi.mock('../src/glass/renderer/cardRefraction', () => ({
  getCardRenderer: () => getCardRenderer(),
}));

let intersectionCallbacks: IntersectionObserverCallback[] = [];

beforeEach(() => {
  renderTo.mockClear();
  getCardRenderer.mockClear();
  getCardRenderer.mockImplementation(() => (available ? fakeRenderer : null));
  resetCardRendererListeners();
  intersectionCallbacks = [];
  available = true;
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(cb: IntersectionObserverCallback) {
        intersectionCallbacks.push(cb);
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  Object.defineProperty(window, 'devicePixelRatio', { value: 2, configurable: true });
  Object.defineProperty(window, 'innerWidth', { value: 1440, configurable: true });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const rect = (x: number, y: number, w: number, h: number) =>
  ({ left: x, top: y, width: w, height: h, right: x + w, bottom: y + h, x, y, toJSON: () => ({}) }) as DOMRect;

const makeImage = () => {
  const img = document.createElement('img');
  Object.defineProperty(img, 'complete', { value: true });
  Object.defineProperty(img, 'naturalWidth', { value: 640 });
  img.getBoundingClientRect = () => rect(0, 0, 400, 200);
  return img;
};

const setup = (tier: 'enhanced' | 'lite' | 'fallback' = 'enhanced') => {
  const reportReason = vi.fn();
  const imageRef = createRef<HTMLImageElement>() as { current: HTMLImageElement | null };
  imageRef.current = makeImage();

  const utils = render(
    <GlassContext.Provider value={{ tier, reasons: [], pageVisible: true, downgrade: vi.fn(), reportReason }}>
      <RefractiveOverlay imageRef={imageRef} className="chip">
        <span>Ground Floor</span>
      </RefractiveOverlay>
    </GlassContext.Provider>,
  );
  const wrap = utils.container.querySelector('[data-refractive-overlay]') as HTMLElement | null;
  if (wrap) wrap.getBoundingClientRect = () => rect(20, 20, 100, 30);
  return { ...utils, wrap, reportReason };
};

const intersect = async (isIntersecting: boolean) => {
  await act(async () => {
    intersectionCallbacks.forEach((cb) => cb([{ isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver));
    // let the lazily imported renderer module resolve
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
};

describe('RefractiveOverlay', () => {
  it('always shows its label content', () => {
    setup('fallback');
    expect(screen.getByText('Ground Floor')).toBeInTheDocument();
  });

  it('does not touch WebGL at all until its card is on screen', async () => {
    setup();
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    // no context, no shader compile, no renderer chunk: the page is not slowed down at load
    expect(getCardRenderer).not.toHaveBeenCalled();
    expect(renderTo).not.toHaveBeenCalled();
  });

  it('creates the shared renderer and draws once, statically, when the card scrolls into view', async () => {
    const { wrap } = setup();
    await intersect(true);
    await waitFor(() => expect(renderTo).toHaveBeenCalledTimes(1));
    expect(getCardRenderer).toHaveBeenCalled();
    const [targetCanvas, , lens, area] = renderTo.mock.calls[0];
    expect(wrap!.contains(targetCanvas)).toBe(true);
    // 100x30 overlay at (20,20) on a 400x200 image at dpr 2 (desktop cap)
    expect(targetCanvas.width).toBe(200);
    expect(targetCanvas.height).toBe(60);
    expect([...(lens as Float32Array)]).toEqual([40, (200 - 20 - 30) * 2, 200, 60, 0]);
    expect(area).toEqual({ width: 800, height: 400, cropX: 40, cropY: 40 });
    await intersect(true);
    expect(renderTo).toHaveBeenCalledTimes(1); // no repeated drawing without a trigger
  });

  it('never loads or draws anything on lite or fallback tiers', async () => {
    setup('lite');
    await intersect(true);
    setup('fallback');
    await intersect(true);
    expect(getCardRenderer).not.toHaveBeenCalled();
    expect(renderTo).not.toHaveBeenCalled();
  });

  it('keeps the plain label and drops its canvas when WebGL turns out to be unavailable', async () => {
    available = false;
    const { container } = setup();
    await intersect(true);
    await waitFor(() => expect(container.querySelector('canvas')).toBeNull());
    expect(renderTo).not.toHaveBeenCalled();
    expect(screen.getByText('Ground Floor')).toBeInTheDocument();
  });

  it('redraws after a hover transition on its card, and not otherwise', async () => {
    const card = document.createElement('div');
    card.className = 'group';
    document.body.appendChild(card);
    const imageRef = { current: makeImage() } as { current: HTMLImageElement | null };
    const { container } = render(
      <GlassContext.Provider value={{ tier: 'enhanced', reasons: [], pageVisible: true, downgrade: vi.fn(), reportReason: vi.fn() }}>
        <RefractiveOverlay imageRef={imageRef}>
          <span>chip</span>
        </RefractiveOverlay>
      </GlassContext.Provider>,
      { container: card },
    );
    (container.querySelector('[data-refractive-overlay]') as HTMLElement).getBoundingClientRect = () => rect(20, 20, 100, 30);
    await intersect(true);
    await waitFor(() => expect(renderTo).toHaveBeenCalledTimes(1));

    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    await act(async () => {
      card.dispatchEvent(new Event('pointerenter'));
      vi.advanceTimersByTime(900);
    });
    vi.useRealTimers();
    await waitFor(() => expect(renderTo).toHaveBeenCalledTimes(2));
    card.remove();
  });

  it('falls back to the plain label and reports the reason when the shared renderer disables itself', async () => {
    const { container, reportReason } = setup();
    await intersect(true);
    await waitFor(() => expect(container.querySelector('canvas')).not.toBeNull());
    act(() => emitCardRendererDisabled());
    expect(container.querySelector('canvas')).toBeNull();
    expect(reportReason).toHaveBeenCalledWith('card-refraction-disabled');
    expect(screen.getByText('Ground Floor')).toBeInTheDocument();
  });

  it('stops listening for the disabled signal when unmounted', async () => {
    const { unmount, reportReason } = setup();
    unmount();
    act(() => emitCardRendererDisabled());
    expect(reportReason).not.toHaveBeenCalled();
  });
});
