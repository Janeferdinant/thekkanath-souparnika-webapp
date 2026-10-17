import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Task 1: Brand Assets & Visual Design Tokens', () => {
  it('defines CSS custom properties for the Burgundy & Rose Gold luxury palette', () => {
    const themeCssPath = path.resolve(__dirname, '../src/styles/theme.css');
    expect(fs.existsSync(themeCssPath)).toBe(true);

    const content = fs.readFileSync(themeCssPath, 'utf-8');
    expect(content).toContain('--color-burgundy: #5B1D27');
    expect(content).toContain('--color-wine: #4A0E17');
    expect(content).toContain('--color-plum: #1A0510');
    expect(content).toContain('--color-rose-gold: #E5A99B');
    expect(content).toContain('--color-champagne: #D4AF37');
    expect(content).toContain('--color-ivory: #FDFBF7');
  });

  it('configures Cormorant Garamond and Inter fonts in index.html', () => {
    const indexPath = path.resolve(__dirname, '../index.html');
    const indexHtml = fs.readFileSync(indexPath, 'utf-8');

    expect(indexHtml).toContain('fonts.googleapis.com');
    expect(indexHtml).toContain('Cormorant+Garamond');
    expect(indexHtml).toContain('Inter');
  });

  it('deploys the brand assets into public/assets/brand', () => {
    const brandDir = path.resolve(__dirname, '../public/assets/brand');
    expect(fs.existsSync(brandDir)).toBe(true);

    const files = fs.readdirSync(brandDir);
    expect(files.some((f) => f.includes('lotus') || f.includes('Lotus'))).toBe(true);
  });
});
