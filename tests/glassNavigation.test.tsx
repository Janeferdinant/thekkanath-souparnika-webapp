import { describe, it, expect, vi, afterEach } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { GlassNavigation } from '../src/glass/GlassNavigation';
import { PublicHeader } from '../src/components/public/PublicHeader';
import { getLenses } from '../src/glass/lensRegistry';

type IOCallback = (entries: { isIntersecting: boolean }[]) => void;
let observers: { cb: IOCallback; observed: Element[]; options?: IntersectionObserverInit; disconnected: boolean }[] = [];

const stubIntersectionObserver = () => {
  observers = [];
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      entry: (typeof observers)[number];
      constructor(cb: IOCallback, options?: IntersectionObserverInit) {
        this.entry = { cb, observed: [], options, disconnected: false };
        observers.push(this.entry);
      }
      observe(el: Element) {
        this.entry.observed.push(el);
      }
      unobserve() {}
      disconnect() {
        this.entry.disconnected = true;
      }
    },
  );
};

const setIntersecting = (isIntersecting: boolean) => act(() => observers.forEach((o) => o.cb([{ isIntersecting }])));

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
});

describe('GlassNavigation', () => {
  it('is over-hero while the hero sentinel intersects and scrolled after', () => {
    stubIntersectionObserver();
    render(
      <>
        <div id="hero-sentinel" />
        <GlassNavigation heroSentinelId="hero-sentinel">
          <span>nav</span>
        </GlassNavigation>
      </>,
    );
    const header = screen.getByRole('banner');
    expect(observers[0].observed[0].id).toBe('hero-sentinel');
    setIntersecting(true);
    expect(header.getAttribute('data-nav-state')).toBe('over-hero');
    setIntersecting(false);
    expect(header.getAttribute('data-nav-state')).toBe('scrolled');
  });

  it('is always scrolled without a sentinel', () => {
    stubIntersectionObserver();
    render(
      <GlassNavigation>
        <span>nav</span>
      </GlassNavigation>,
    );
    expect(screen.getByRole('banner').getAttribute('data-nav-state')).toBe('scrolled');
    expect(observers).toHaveLength(0);
  });

  it('is always scrolled when the sentinel id is not in the DOM', () => {
    stubIntersectionObserver();
    render(
      <GlassNavigation heroSentinelId="missing">
        <span>nav</span>
      </GlassNavigation>,
    );
    expect(screen.getByRole('banner').getAttribute('data-nav-state')).toBe('scrolled');
  });

  it('registers as a lens only while over the hero, and disconnects on unmount', () => {
    stubIntersectionObserver();
    const { unmount } = render(
      <>
        <div id="hero-sentinel" />
        <GlassNavigation heroSentinelId="hero-sentinel">
          <span>nav</span>
        </GlassNavigation>
      </>,
    );
    setIntersecting(true);
    expect(getLenses()).toHaveLength(1);
    setIntersecting(false);
    expect(getLenses()).toHaveLength(0);
    unmount();
    expect(observers[0].disconnected).toBe(true);
  });
});

describe('PublicHeader mobile menu', () => {
  const renderHeader = () =>
    render(
      <MemoryRouter initialEntries={['/halls']}>
        <PublicHeader />
      </MemoryRouter>,
    );

  it('toggles aria-expanded on the menu button', () => {
    renderHeader();
    const toggle = screen.getByRole('button', { name: /toggle navigation menu/i });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
  });

  it('closes on Escape and returns focus to the toggle', () => {
    renderHeader();
    const toggle = screen.getByRole('button', { name: /toggle navigation menu/i });
    fireEvent.click(toggle);
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(toggle);
  });

  it('lists every destination plus the enquiry link in the menu', () => {
    renderHeader();
    fireEvent.click(screen.getByRole('button', { name: /toggle navigation menu/i }));
    const drawer = screen.getByTestId('mobile-nav');
    const hrefs = [...drawer.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    for (const path of ['/', '/halls', '/facilities', '/gallery', '/contact', '/faq', '/enquire']) {
      expect(hrefs, path).toContain(path);
    }
  });

  it('gives the Staff Studio link and the menu button a 44px touch target', () => {
    renderHeader();
    const staff = screen.getByRole('link', { name: /staff/i });
    expect(staff.className).toContain('min-h-[44px]');
    const toggle = screen.getByRole('button', { name: /toggle navigation menu/i });
    expect(toggle.className).toContain('min-h-[44px]');
    expect(toggle.className).toContain('min-w-[44px]');
  });
});
