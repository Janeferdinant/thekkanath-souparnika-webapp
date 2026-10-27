import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, RouterProvider, createMemoryRouter } from 'react-router-dom';
import { createRef } from 'react';
import { routes } from '../src/app/routes';
import { HeroSection } from '../src/components/public/HeroSection';
import { RefractiveOverlay } from '../src/glass/RefractiveOverlay';
import { GlassContext } from '../src/glass/GlassPerformanceManager';
import { installChunkRecovery } from '../src/app/chunkRecovery';

// A chunk that cannot be fetched (flaky mobile network, or a file that is gone after a redeploy)
// rejects its dynamic import. These tests make three different chunks fail that way.
vi.mock('../src/glass/renderer/HeroRefraction', () => {
  throw new Error('Failed to fetch dynamically imported module');
});
vi.mock('../src/glass/renderer/cardRefraction', () => {
  throw new Error('Failed to fetch dynamically imported module');
});
vi.mock('../src/features/public/HallsPage', () => {
  throw new Error('Failed to fetch dynamically imported module');
});

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => undefined); // React logs caught render errors
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

const capable = (downgrade = vi.fn()) => ({ tier: 'enhanced' as const, reasons: [], pageVisible: true, downgrade, reportReason: vi.fn() });

describe('a decorative renderer chunk that fails to load', () => {
  it('leaves the hero fully usable: the photo, the copy and the buttons stay', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'], shouldAdvanceTime: true });
    vi.stubGlobal('requestIdleCallback', undefined);
    const { container } = render(
      <MemoryRouter>
        <GlassContext.Provider value={capable()}>
          <HeroSection />
        </GlassContext.Provider>
      </MemoryRouter>,
    );
    const img = container.querySelector('[data-hero-frame] img') as HTMLImageElement;
    Object.defineProperty(img, 'naturalWidth', { value: 1086, configurable: true });
    fireEvent.load(img);
    await act(async () => {
      vi.advanceTimersByTime(300);
      await new Promise((resolve) => setTimeout(resolve, 150));
    });

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Thekkanath Souparnika');
    expect(screen.getByRole('link', { name: /Explore the Halls/ })).toBeInTheDocument();
    expect(container.querySelector('[data-hero-frame] img')).not.toBeNull();
    expect(container.querySelector('[data-hero-frame] canvas')).toBeNull();
    expect(screen.queryByText(/unexpected application error/i)).toBeNull();
  });
});

describe('a card renderer chunk that fails to load', () => {
  it('keeps the label, drops the canvas, and does not leave an unhandled rejection', async () => {
    const unhandled = vi.fn();
    process.on('unhandledRejection', unhandled);
    let callbacks: IntersectionObserverCallback[] = [];
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(cb: IntersectionObserverCallback) {
          callbacks.push(cb);
        }
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
    const img = document.createElement('img');
    Object.defineProperty(img, 'complete', { value: true });
    Object.defineProperty(img, 'naturalWidth', { value: 640 });
    const rect = (w: number, h: number) => ({ left: 0, top: 0, width: w, height: h, right: w, bottom: h, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;
    img.getBoundingClientRect = () => rect(400, 200);
    const imageRef = createRef<HTMLImageElement>() as { current: HTMLImageElement | null };
    imageRef.current = img;

    const { container } = render(
      <GlassContext.Provider value={capable()}>
        <RefractiveOverlay imageRef={imageRef}>
          <span>Ground Floor</span>
        </RefractiveOverlay>
      </GlassContext.Provider>,
    );
    (container.querySelector('[data-refractive-overlay]') as HTMLElement).getBoundingClientRect = () => rect(100, 30);

    await act(async () => {
      callbacks.forEach((cb) => cb([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(screen.getByText('Ground Floor')).toBeInTheDocument();
    await waitFor(() => expect(container.querySelector('canvas')).toBeNull());
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(unhandled).not.toHaveBeenCalled();
    process.off('unhandledRejection', unhandled);
    callbacks = [];
  });
});

describe('a page chunk that fails to load', () => {
  const renderAt = (path: string) => render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />);

  it('shows a friendly retry screen instead of the default application error', async () => {
    renderAt('/halls');
    expect(await screen.findByText(/didn.t load/i)).toBeInTheDocument();
    expect(screen.queryByText(/unexpected application error/i)).toBeNull();
    expect(screen.getByRole('button', { name: /reload/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /go to the home page/i })).toHaveAttribute('href', '/');
  });

  it('keeps the site header and footer around the message', async () => {
    renderAt('/halls');
    await screen.findByText(/didn.t load/i);
    expect(screen.getAllByRole('link', { name: /thekkanath souparnika/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('does not affect other pages', async () => {
    renderAt('/');
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Thekkanath Souparnika');
  });
});

describe('chunk recovery after a redeploy', () => {
  const makeWin = (stored: Record<string, string> = {}) => {
    const reload = vi.fn();
    const listeners: Record<string, (e: Event) => void> = {};
    const win = {
      addEventListener: (type: string, fn: (e: Event) => void) => {
        listeners[type] = fn;
      },
      location: { reload },
      sessionStorage: {
        getItem: (k: string) => stored[k] ?? null,
        setItem: (k: string, v: string) => {
          stored[k] = v;
        },
      },
    } as unknown as Window;
    return { win, reload, fire: () => listeners['vite:preloadError']?.(new Event('vite:preloadError', { cancelable: true })), stored };
  };

  it('reloads once when Vite reports a failed preload', () => {
    const { win, reload, fire } = makeWin();
    installChunkRecovery(win);
    fire();
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('never reloads twice in a row, so a genuinely missing file cannot loop', () => {
    const { win, reload, fire } = makeWin();
    installChunkRecovery(win);
    fire();
    fire();
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('still behaves when sessionStorage is blocked', () => {
    const { win, reload, fire } = makeWin();
    Object.defineProperty(win, 'sessionStorage', {
      get() {
        throw new DOMException('blocked', 'SecurityError');
      },
    });
    installChunkRecovery(win);
    expect(() => fire()).not.toThrow();
    expect(reload).toHaveBeenCalledTimes(0); // cannot guard against a loop, so it does not risk one
  });
});
