import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { BRAND } from '../src/styles/brandTokens';

const css = readFileSync('src/styles/theme.css', 'utf8');

const channel = (v: number) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const luminance = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
};
const contrast = (fg: string, bg: string) => {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
};

describe('brand tokens', () => {
  it('mirrors every BRAND entry as a --brand-* custom property in theme.css', () => {
    for (const [key, value] of Object.entries(BRAND)) {
      expect(css, key).toContain(`--brand-${key}: ${value}`);
    }
  });

  it('keeps the anchor colours from the design doc', () => {
    expect(BRAND['burgundy-700']).toBe('#541B2A');
    expect(BRAND['champagne-500']).toBe('#C9A56A');
    expect(BRAND['ivory-100']).toBe('#F8F3EB');
  });

  // Every pairing the public site uses for text or UI boundaries: AA = 4.5:1.
  const PAIRS: [string, string][] = [
    ['charcoal-900', 'ivory-100'],
    ['charcoal-600', 'ivory-100'],
    ['charcoal-600', 'ivory-200'],
    ['bronze-700', 'ivory-100'],
    ['burgundy-700', 'ivory-100'],
    ['ivory-100', 'burgundy-700'],
    ['champagne-500', 'burgundy-700'],
    ['champagne-300', 'burgundy-900'],
    ['ivory-muted', 'burgundy-900'],
    ['burgundy-900', 'champagne-500'],
  ];
  it.each(PAIRS)('%s on %s meets WCAG AA (4.5:1)', (fg, bg) => {
    expect(contrast(BRAND[fg], BRAND[bg]), `${fg}/${bg}`).toBeGreaterThanOrEqual(4.5);
  });

  it('documents that champagne is never text on ivory (under 3:1)', () => {
    expect(contrast(BRAND['champagne-500'], BRAND['ivory-100'])).toBeLessThan(3);
  });

  it('defines the surface classes with focus outlines', () => {
    for (const cls of ['.surface-ivory', '.surface-ivory-alt', '.surface-burgundy']) {
      expect(css).toContain(cls);
      expect(css).toContain(`${cls} :focus-visible`);
    }
  });
});
