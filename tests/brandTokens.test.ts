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

  // Dark glass is translucent, so its real background is the fill blended over whatever is behind it.
  const blend = (fg: string, alpha: number, bg: string) => {
    const f = parseInt(fg.slice(1), 16);
    const b = parseInt(bg.slice(1), 16);
    const mix = (shift: number) => Math.round(((f >> shift) & 255) * alpha + ((b >> shift) & 255) * (1 - alpha));
    return '#' + [16, 8, 0].map((sh) => mix(sh).toString(16).padStart(2, '0')).join('');
  };
  const glassCss = readFileSync('src/styles/glass.css', 'utf8');
  const fillAlpha = (selectorStart: string) => {
    const re = new RegExp(selectorStart + String.raw`[^{}]*\{[^}]*--glass-fill-dark:\s*rgba\(46,\s*15,\s*25,\s*([0-9.]+)\)`);
    const m = re.exec(glassCss);
    expect(m, selectorStart).not.toBeNull();
    return parseFloat(m![1]);
  };

  it('dark glass on a light surface keeps its text at AA (default fill over ivory)', () => {
    const alpha = fillAlpha(String.raw`\.glass-surface`);
    const bg = blend(BRAND['burgundy-900'], alpha, BRAND['ivory-50']);
    for (const text of ['ivory-100', 'ivory-muted', 'champagne-300']) {
      expect(contrast(BRAND[text], bg), `${text} on dark glass (alpha ${alpha}) over ivory`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('dark glass over the hero photo (lens) keeps ivory text at AA against a bright paving highlight', () => {
    const alpha = fillAlpha(String.raw`\.glass-surface\[data-glass-lens\]`);
    const brightPaving = '#FFC864';
    const bg = blend(BRAND['burgundy-900'], alpha, brightPaving);
    expect(contrast(BRAND['ivory-100'], bg), `alpha ${alpha}`).toBeGreaterThanOrEqual(4.5);
  });

  it('the chip tint is a layer above the refraction canvas, so it always covers the photo', () => {
    // an element's own background paints below a z-index:-1 canvas; the ::after tint paints above it
    expect(glassCss).toMatch(/\.refractive-overlay::after\s*\{[^}]*z-index:\s*-1/);
    const own = /\.refractive-overlay\s*\{([^}]*)\}/.exec(glassCss);
    expect(own).not.toBeNull();
    expect(own![1]).not.toMatch(/background:/);
  });

  it('badges and caption chips on photos keep their text at AA even over a white wall', () => {
    const m = /\.refractive-overlay::after\s*\{[^}]*background:\s*rgba\(46,\s*15,\s*25,\s*([0-9.]+)\)/.exec(glassCss);
    expect(m).not.toBeNull();
    const bg = blend(BRAND['burgundy-900'], parseFloat(m![1]), '#FFFFFF');
    for (const text of ['ivory-100', 'champagne-300']) {
      expect(contrast(BRAND[text], bg), `${text} on a chip (alpha ${m![1]}) over white`).toBeGreaterThanOrEqual(4.5);
    }
  });

  describe('focus rings', () => {
    const all = css + '\n' + glassCss;
    /** The brand colour used by the outline declared right after `selector`. */
    const ringColour = (selector: string): string | null => {
      const at = all.indexOf(selector);
      if (at < 0) return null;
      const open = all.indexOf('{', at); // the rule this selector belongs to, grouped or not
      const body = all.slice(open, all.indexOf('}', open));
      return /outline:\s*2px solid var\(--brand-([a-z]+-[0-9]+)\)/.exec(body)?.[1] ?? null;
    };

    it('the whole public site has a visible ring by default, burgundy on the ivory base', () => {
      expect(ringColour('.public-luxury :focus-visible')).toBe('burgundy-700');
    });

    it.each(['.surface-burgundy :focus-visible', '.public-strip :focus-visible', ".glass-surface[data-tone='dark'] :focus-visible"])(
      'dark surface %s uses champagne and is declared after the default so it wins',
      (selector) => {
        expect(ringColour(selector)).toBe('champagne-400');
        expect(all.indexOf(selector)).toBeGreaterThan(all.indexOf('.public-luxury :focus-visible {'));
      },
    );
  });
});
