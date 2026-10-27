import { describe, it, expect, vi, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { render, screen } from '@testing-library/react';
import { GlassSurface } from '../src/glass/GlassSurface';
import { GlassCard } from '../src/glass/GlassCard';
import { GlassHeroPanel } from '../src/glass/GlassHeroPanel';
import { getLenses } from '../src/glass/lensRegistry';
import { GlassPerformanceManager } from '../src/glass/GlassPerformanceManager';
import type { GlassEnvironment } from '../src/glass/capabilities';

const CAPABLE: GlassEnvironment = {
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

afterEach(() => {
  vi.restoreAllMocks();
  // @ts-expect-error cleanup of the matchMedia stub
  delete window.matchMedia;
});

const stubFinePointer = () => {
  window.matchMedia = ((q: string) => ({
    matches: q.includes('pointer: fine'),
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  })) as unknown as typeof window.matchMedia;
};

// React attaches its own delegated listeners on the root container, so only count listeners
// registered on the surface element itself.
const listenersOn = (spy: ReturnType<typeof vi.spyOn>, el: Element, type: string) =>
  spy.mock.calls.filter(([t], i) => t === type && spy.mock.contexts[i] === el);

describe('GlassSurface', () => {
  it('renders the requested tag with its tone and elevation', () => {
    render(
      <GlassSurface as="section" tone="dark" elevation="raised" data-testid="s">
        hello
      </GlassSurface>,
    );
    const el = screen.getByTestId('s');
    expect(el.tagName).toBe('SECTION');
    expect(el.getAttribute('data-tone')).toBe('dark');
    expect(el.getAttribute('data-elevation')).toBe('raised');
    expect(el.classList.contains('glass-surface')).toBe(true);
  });

  it('registers a lens on mount and unregisters on unmount', () => {
    expect(getLenses().length).toBe(0);
    const { unmount } = render(
      <GlassSurface tone="dark" lens>
        x
      </GlassSurface>,
    );
    expect(getLenses().length).toBe(1);
    expect(getLenses()[0].hasAttribute('data-glass-lens')).toBe(true);
    unmount();
    expect(getLenses().length).toBe(0);
  });

  it('GlassHeroPanel is a dark raised lens', () => {
    render(<GlassHeroPanel data-testid="p">x</GlassHeroPanel>);
    const el = screen.getByTestId('p');
    expect(el.getAttribute('data-tone')).toBe('dark');
    expect(el.getAttribute('data-elevation')).toBe('raised');
    expect(el.hasAttribute('data-glass-lens')).toBe(true);
  });

  it('GlassCard defaults to a light raised interactive card', () => {
    render(<GlassCard data-testid="c">x</GlassCard>);
    const el = screen.getByTestId('c');
    expect(el.getAttribute('data-tone')).toBe('light');
    expect(el.getAttribute('data-elevation')).toBe('raised');
    expect(el.hasAttribute('data-interactive')).toBe(true);
  });
});

describe('usePointerLight', () => {
  it('attaches no pointer listener when the tier is lite', () => {
    stubFinePointer();
    const spy = vi.spyOn(HTMLElement.prototype, 'addEventListener');
    render(
      <GlassPerformanceManager env={{ ...CAPABLE, webgl: false }}>
        <GlassSurface tone="light" interactive data-testid="s">
          x
        </GlassSurface>
      </GlassPerformanceManager>,
    );
    expect(listenersOn(spy, screen.getByTestId('s'), 'pointermove')).toHaveLength(0);
  });

  it('attaches a pointer listener on enhanced with a fine pointer, and sets the light position', () => {
    stubFinePointer();
    const addSpy = vi.spyOn(HTMLElement.prototype, 'addEventListener');
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    });
    render(
      <GlassPerformanceManager env={CAPABLE}>
        <GlassSurface tone="light" interactive data-testid="s">
          x
        </GlassSurface>
      </GlassPerformanceManager>,
    );
    const el = screen.getByTestId('s');
    expect(listenersOn(addSpy, el, 'pointermove')).toHaveLength(1);
    el.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 100, right: 200, bottom: 100, x: 0, y: 0, toJSON: () => ({}) });
    el.dispatchEvent(new MouseEvent('pointermove', { clientX: 50, clientY: 25, bubbles: true }));
    expect(el.style.getPropertyValue('--glass-light-x')).toBe('0.25');
    expect(el.style.getPropertyValue('--glass-light-y')).toBe('0.25');
    vi.unstubAllGlobals();
  });

  it('attaches nothing without a fine pointer, even on enhanced', () => {
    const spy = vi.spyOn(HTMLElement.prototype, 'addEventListener');
    render(
      <GlassPerformanceManager env={CAPABLE}>
        <GlassSurface tone="light" interactive data-testid="s">
          x
        </GlassSurface>
      </GlassPerformanceManager>,
    );
    expect(listenersOn(spy, screen.getByTestId('s'), 'pointermove')).toHaveLength(0);
  });
});

describe('glass.css', () => {
  const css = readFileSync('src/styles/glass.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ selector: m[1].trim().replace(/'/g, '"'), body: m[2] }));

  it('fallback tier rules never depend on backdrop-filter', () => {
    const fallbackRules = rules.filter((r) => r.selector.includes('[data-glass-tier="fallback"]'));
    expect(fallbackRules.length).toBeGreaterThan(0);
    for (const r of fallbackRules) expect(r.body, r.selector).not.toContain('backdrop-filter');
  });

  it('has an @supports not (backdrop-filter) fallback for browsers without blur', () => {
    expect(css).toMatch(/@supports not \(\(backdrop-filter: blur\(1px\)\) or \(-webkit-backdrop-filter: blur\(1px\)\)\)/);
  });

  it('only the lite and enhanced tiers (and the pre-JS default) apply blur', () => {
    const blurred = rules.filter((r) => r.body.includes('backdrop-filter'));
    expect(blurred.length).toBeGreaterThan(0);
    for (const r of blurred) expect(r.selector).not.toContain('fallback');
  });

  it('is imported from the stylesheet entry', () => {
    expect(readFileSync('src/styles/index.css', 'utf8')).toContain("@import './glass.css'");
  });
});
