import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { render } from '@testing-library/react';
import manifest from '../src/data/imageManifest.json';
import { ResponsivePicture } from '../src/components/public/ResponsivePicture';

type Entry = { width: number; height: number; alt: string; avif: string; webp: string; jpg: string; fallback: string };
const entries = Object.entries(manifest as Record<string, Entry>);

const urlsOf = (srcset: string) => srcset.split(',').map((part) => part.trim().split(/\s+/)[0]);
const widthsOf = (srcset: string) => srcset.split(',').map((part) => parseInt(part.trim().split(/\s+/)[1], 10));

describe('image manifest', () => {
  it('manifest lists only files that exist', () => {
    expect(entries.length).toBe(8);
    for (const [, e] of entries) {
      for (const url of [...urlsOf(e.avif), ...urlsOf(e.webp), ...urlsOf(e.jpg), e.fallback]) {
        expect(existsSync('public' + url), url).toBe(true);
      }
    }
  });

  it('never upscales the hero', () => {
    const hero = (manifest as Record<string, Entry>)['hero-entrance'];
    expect(widthsOf(hero.avif)).toEqual([480, 768, 1086]);
    expect(widthsOf(hero.webp)).toEqual([480, 768, 1086]);
    expect(widthsOf(hero.jpg)).toEqual([480, 768, 1086]);
    expect(hero.width).toBe(1086);
    expect(hero.height).toBe(1448);
  });

  it('never upscales any venue photo past its source width', () => {
    for (const [key, e] of entries) {
      expect(Math.max(...widthsOf(e.jpg)), key).toBeLessThanOrEqual(e.width);
    }
  });
});

describe('ResponsivePicture', () => {
  it('renders a prioritised hero picture', () => {
    const { container } = render(<ResponsivePicture image="hero-entrance" sizes="(min-width:1024px) 600px, 100vw" priority />);
    const sources = [...container.querySelectorAll('source')].map((s) => s.getAttribute('type'));
    expect(sources.indexOf('image/avif')).toBeGreaterThanOrEqual(0);
    expect(sources.indexOf('image/avif')).toBeLessThan(sources.indexOf('image/webp'));
    const img = container.querySelector('img')!;
    expect(img.getAttribute('width')).toBe('1086');
    expect(img.getAttribute('height')).toBe('1448');
    expect(img.getAttribute('fetchpriority')).toBe('high');
    expect(img.hasAttribute('loading')).toBe(false);
  });

  it('lazy-loads non-priority pictures', () => {
    const { container } = render(<ResponsivePicture image="venue-000" sizes="100vw" />);
    const img = container.querySelector('img')!;
    expect(img.getAttribute('loading')).toBe('lazy');
    expect(img.getAttribute('decoding')).toBe('async');
  });
});
