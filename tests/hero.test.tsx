import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HeroSection } from '../src/components/public/HeroSection';
import { VENUE_INFO } from '../src/data/venueData';

const renderHero = () =>
  render(
    <MemoryRouter>
      <HeroSection />
    </MemoryRouter>,
  );

const frameOf = (container: HTMLElement) => container.querySelector('[data-hero-frame]') as HTMLElement;

describe('HeroSection photo', () => {
  it('has exactly one prioritised, non-lazy image with intrinsic size inside the frame', () => {
    const { container } = renderHero();
    const imgs = frameOf(container).querySelectorAll('img');
    expect(imgs).toHaveLength(1);
    const img = imgs[0];
    expect(img.getAttribute('fetchpriority')).toBe('high');
    expect(img.hasAttribute('loading')).toBe(false);
    expect(img.getAttribute('width')).toBe('1086');
    expect(img.getAttribute('height')).toBe('1448');
    expect(img.getAttribute('src')).toContain('entrance-1086.jpg');
  });

  it('never asks for more than 681 CSS px on screens wider than a phone (the source is 1086 px wide)', () => {
    const { container } = renderHero();
    const sizes = frameOf(container).querySelector('img')!.getAttribute('sizes')!;
    // desktop: 54% of the max-w-7xl content width plus 24px reaching toward the title, matching the grid
    expect(sizes).toContain('(min-width:1280px) 681px');
    expect(sizes).toContain('(min-width:1024px) calc(54vw - 11px)');
    expect(sizes).toContain('(min-width:768px) 600px');
    expect(sizes).toContain('100vw');
  });

  it('preloads the hero with the same sizes the image uses, so the preloaded file is the one shown', () => {
    const { container } = renderHero();
    const sizes = frameOf(container).querySelector('img')!.getAttribute('sizes')!;
    expect(readFileSync('index.html', 'utf8')).toContain(`imagesizes="${sizes.replace(/,\s*/g, ', ')}"`);
  });

  it('marks the frame ready only after the image really loads', () => {
    const { container } = renderHero();
    const frame = frameOf(container);
    const img = frame.querySelector('img')!;
    expect(frame.getAttribute('data-ready')).toBe('false');
    Object.defineProperty(img, 'naturalWidth', { value: 1086, configurable: true });
    fireEvent.load(img);
    expect(frame.getAttribute('data-ready')).toBe('true');
  });

  it('stays not-ready after an error event, so the renderer never mounts (slow or failed image)', () => {
    const { container } = renderHero();
    const frame = frameOf(container);
    fireEvent.error(frame.querySelector('img')!);
    expect(frame.getAttribute('data-ready')).toBe('false');
    expect(frame.querySelector('canvas')).toBeNull();
    // the hero copy is still there and readable on the burgundy surface
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Thekkanath Souparnika');
  });

  it('does not treat a zero-width load as ready', () => {
    const { container } = renderHero();
    const frame = frameOf(container);
    fireEvent.load(frame.querySelector('img')!);
    expect(frame.getAttribute('data-ready')).toBe('false');
  });
});

describe('HeroSection content', () => {
  it('links Get Directions to the venue map', () => {
    renderHero();
    const link = screen.getByRole('link', { name: /get directions/i });
    expect(link.getAttribute('href')).toBe(VENUE_INFO.googleMapsUrl);
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toContain('noreferrer');
  });

  it('exposes the sentinel the navigation observes', () => {
    const { container } = renderHero();
    const sentinel = container.querySelector('#hero-sentinel')!;
    expect(sentinel).not.toBeNull();
    expect(sentinel.getAttribute('aria-hidden')).toBe('true');
  });

  it('keeps the required hero copy and actions', () => {
    renderHero();
    expect(screen.getByText('Traditional & Contemporary Celebrations in Thrissur')).toBeInTheDocument();
    expect(document.body.textContent).toContain('Where family milestones');
    expect(document.body.textContent).toContain('feel truly special.');
    expect(screen.getByRole('link', { name: /Explore the Halls/ }).getAttribute('href')).toBe('/halls');
    expect(screen.getByRole('link', { name: /Check Date \/ Enquire/ }).getAttribute('href')).toBe('/enquire');
  });

  it('does not place the info panel over the signage area of the photo', () => {
    const { container } = renderHero();
    const panel = frameOf(container).querySelector('[data-glass-lens]') as HTMLElement;
    expect(panel).not.toBeNull();
    // anchored to the bottom of the frame (the paving), never positioned from the top
    expect(panel.className).toContain('bottom-');
    expect(panel.className).not.toMatch(/(^|\s)(md:|lg:)?top-/);
  });
});

describe('page shell', () => {
  it('index.html preloads the hero image in AVIF at high priority', () => {
    const html = readFileSync('index.html', 'utf8');
    expect(html).toMatch(/rel="preload"[^>]*as="image"/);
    expect(html).toContain('entrance-1086.avif');
    expect(html).toContain('fetchpriority="high"');
  });

  it('no AmbientParticles import remains anywhere in src', () => {
    const walk = (dir: string): string[] =>
      readdirSync(dir).flatMap((n) => {
        const p = join(dir, n);
        return statSync(p).isDirectory() ? walk(p) : [p];
      });
    const offenders = walk('src').filter((f) => /\.(tsx?|css)$/.test(f) && readFileSync(f, 'utf8').includes('AmbientParticles'));
    expect(offenders).toEqual([]);
  });
});
