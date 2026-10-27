import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import sharp from 'sharp';
import { BRAND } from '../src/styles/brandTokens';

/**
 * The transparent navigation sits on the real hero photo, so its text contrast depends on the photo,
 * not just on two flat colours. This samples the actual image under the logo area (after the nav's
 * 14px backdrop blur and its tint) and checks the small text against WCAG AA.
 */
const css = readFileSync('src/styles/glass.css', 'utf8');

const overHero = /\.glass-nav-bar\[data-nav-state='over-hero'\]\s*\{[^}]*linear-gradient\(180deg,\s*rgba\(30,\s*10,\s*16,\s*([0-9.]+)\),\s*rgba\(30,\s*10,\s*16,\s*([0-9.]+)\)\)/.exec(css);

const lum = (rgb: number[]) => {
  const c = rgb.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contrast = (a: number[], b: number[]) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

const NAV_PX = 80;
const TINT = [30, 10, 16]; // burgundy-950 at the nav's own alpha

async function worstContrast(frameWidth: number, xFrac: [number, number], textHex: string) {
  const [topAlpha, bottomAlpha] = [parseFloat(overHero![1]), parseFloat(overHero![2])];
  const frameHeight = Math.round((frameWidth * 4) / 3);
  const { data, info } = await sharp('public/assets/venue/hero/entrance-768.jpg')
    .resize({ width: frameWidth, height: frameHeight, fit: 'cover' })
    .blur(14) // backdrop-filter: blur(14px) is a 14px standard deviation
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const text = hex(textHex);
  const ratios: number[] = [];
  for (let y = 0; y < Math.min(NAV_PX, info.height); y += 2) {
    const a = topAlpha + ((bottomAlpha - topAlpha) * y) / (NAV_PX - 1);
    for (let x = Math.floor(xFrac[0] * info.width); x < Math.floor(xFrac[1] * info.width); x += 4) {
      const i = (y * info.width + x) * 3;
      const bg = [0, 1, 2].map((k) => TINT[k] * a + data[i + k] * (1 - a));
      ratios.push(contrast(text, bg));
    }
  }
  return Math.min(...ratios);
}

describe('transparent navigation over the hero photo', () => {
  it('declares its tint in glass.css', () => {
    expect(overHero).not.toBeNull();
  });

  // [layout, frame width, share of the nav width the logo block occupies]
  const LAYOUTS: [string, number, [number, number]][] = [
    ['phone (full-width frame)', 390, [0.03, 0.65]],
    ['tablet/desktop frame', 559, [0, 1]],
  ];
  const SMALL_TEXT = [
    ['champagne-400', BRAND['champagne-400']],
    ['ivory-muted', BRAND['ivory-muted']],
  ] as const;

  for (const [layout, width, span] of LAYOUTS) {
    for (const [name, colour] of SMALL_TEXT) {
      it(`${name} small text keeps 4.5:1 over the photo on the ${layout}`, async () => {
        expect(await worstContrast(width, span, colour)).toBeGreaterThanOrEqual(4.5);
      });
    }
  }

  it('the large logo name (ivory-100) keeps 3:1 everywhere', async () => {
    for (const [, width, span] of LAYOUTS) {
      expect(await worstContrast(width, span, BRAND['ivory-100'])).toBeGreaterThanOrEqual(3);
    }
  });
});
