import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { RefractiveOverlay } from '../src/glass/RefractiveOverlay';
import { GlassContext } from '../src/glass/GlassPerformanceManager';

const renderTo = vi.fn();
const fakeRenderer = { disabled: false, renderTo };
let disabledListeners: (() => void)[] = [];
let available = true;

vi.mock('../src/glass/renderer/cardRefraction', () => ({
  getCardRenderer: () => (available ? fakeRenderer : null),
  onCardRendererDisabled: (cb: () => void) => {
    disabledListeners.push(cb);
    return () => {
      disabledListeners = disabledListeners.filter((l) => l !== cb);
    };
  },
}));

let intersectionCallbacks: IntersectionObserverCallback[] = [];

beforeEach(() => {
  renderTo.mockClear();
  disabledListeners = [];
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

const setup = (tier: 'enhanced' | 'lite' | 'fallback' = 'enhanced') => {
  const reportReason = vi.fn();
  const img = document.createElement('img');
  Object.defineProperty(img, 'complete', { value: true });
  Object.defineProperty(img, 'naturalWidth', { value: 640 });
  img.getBoundingClientRect = () => rect(0, 0, 400, 200);
  const imageRef = createRef<HTMLImageElement>() as { current: HTMLImageElement | null };
  imageRef.current = img;

  const utils = render(
    <GlassContext.Provider value={{ tier, reasons: [], pageVisible: true, downgrade: vi.fn(), reportReason }}>
      <RefractiveOverlay imageRef={imageRef} className="chip">
        <span>Ground Floor</span>
      </RefractiveOverlay>
    </GlassContext.Provider>,
  );
  const wrap = utils.container.querySelector('[data-refractive-overlay]') as HTMLElement | null;
  if (wrap) wrap.getBoundingClientRect = () => rect(20, 20, 100, 30);
  return { ...utils, wrap, img, reportReason };
};

const intersect = (isIntersecting: boolean) =>
  act(() => intersectionCallbacks.forEach((cb) => cb([{ isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver)));

describe('RefractiveOverlay', () => {
  it('always shows its label content', () => {
    setup('fallback');
    expect(screen.getByText('Ground Floor')).toBeInTheDocument();
  });

  it('does not draw anything while the card is off-screen', () => {
    setup();
    expect(renderTo).not.toHaveBeenCalled();
  });

  it('draws once, statically, when the card scrolls into view', () => {
    const { wrap } = setup();
    intersect(true);
    expect(renderTo).toHaveBeenCalledTimes(1);
    const [targetCanvas, , lens, area] = renderTo.mock.calls[0];
    expect(wrap!.contains(targetCanvas)).toBe(true);
    // 100x30 overlay at (20,20) on a 400x200 image at dpr 2 (desktop cap)
    expect(targetCanvas.width).toBe(200);
    expect(targetCanvas.height).toBe(60);
    expect([...(lens as Float32Array)]).toEqual([40, (200 - 20 - 30) * 2, 200, 60, 0]);
    expect(area).toEqual({ width: 800, height: 400, cropX: 40, cropY: 40 });
    intersect(true);
    expect(renderTo).toHaveBeenCalledTimes(1); // no repeated drawing without a trigger
  });

  it('never draws on lite or fallback tiers', () => {
    setup('lite');
    intersect(true);
    setup('fallback');
    intersect(true);
    expect(renderTo).not.toHaveBeenCalled();
  });

  it('does not draw when WebGL is unavailable and keeps the plain label', () => {
    available = false;
    setup();
    intersect(true);
    expect(renderTo).not.toHaveBeenCalled();
    expect(screen.getByText('Ground Floor')).toBeInTheDocument();
  });

  it('redraws after a hover transition on its card, and not otherwise', () => {
    vi.useFakeTimers();
    const card = document.createElement('div');
    card.className = 'group';
    document.body.appendChild(card);
    const reportReason = vi.fn();
    const img = document.createElement('img');
    Object.defineProperty(img, 'complete', { value: true });
    Object.defineProperty(img, 'naturalWidth', { value: 640 });
    img.getBoundingClientRect = () => rect(0, 0, 400, 200);
    const imageRef = { current: img } as { current: HTMLImageElement | null };
    const { container } = render(
      <GlassContext.Provider value={{ tier: 'enhanced', reasons: [], pageVisible: true, downgrade: vi.fn(), reportReason }}>
        <RefractiveOverlay imageRef={imageRef}>
          <span>chip</span>
        </RefractiveOverlay>
      </GlassContext.Provider>,
      { container: card },
    );
    (container.querySelector('[data-refractive-overlay]') as HTMLElement).getBoundingClientRect = () => rect(20, 20, 100, 30);
    intersect(true);
    expect(renderTo).toHaveBeenCalledTimes(1);

    act(() => {
      card.dispatchEvent(new Event('pointerenter'));
      vi.advanceTimersByTime(900);
    });
    expect(renderTo).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
    card.remove();
  });

  it('falls back to the plain label and reports the reason when the shared renderer disables itself', () => {
    const { container, reportReason } = setup();
    intersect(true);
    expect(container.querySelector('canvas')).not.toBeNull();
    act(() => disabledListeners.forEach((cb) => cb()));
    expect(container.querySelector('canvas')).toBeNull();
    expect(reportReason).toHaveBeenCalledWith('card-refraction-disabled');
    expect(screen.getByText('Ground Floor')).toBeInTheDocument();
  });

  it('stops listening when unmounted', () => {
    const { unmount } = setup();
    expect(disabledListeners.length).toBe(1);
    unmount();
    expect(disabledListeners.length).toBe(0);
  });
});
