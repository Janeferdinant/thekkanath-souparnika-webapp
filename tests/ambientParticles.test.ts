import { describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Public UI - Ambient Particles & Reduced Motion Guard', () => {
  it('implements AmbientParticles component respecting prefers-reduced-motion', () => {
    const compPath = path.resolve(__dirname, '../src/components/public/AmbientParticles.tsx');
    expect(fs.existsSync(compPath)).toBe(true);

    const content = fs.readFileSync(compPath, 'utf-8');
    // Must check for prefers-reduced-motion media query
    expect(content).toContain('prefers-reduced-motion');
    // Must use 2D canvas rather than heavy 3D WebGL
    expect(content).toContain("getContext('2d')");
    // Must clean up animation frames on unmount
    expect(content).toContain('cancelAnimationFrame');
  });

  it('implements PreferredCaterersCard with WhatsApp action links and cuisine tags', () => {
    const catererCardPath = path.resolve(__dirname, '../src/components/public/PreferredCaterersCard.tsx');
    expect(fs.existsSync(catererCardPath)).toBe(true);

    const content = fs.readFileSync(catererCardPath, 'utf-8');
    expect(content).toContain('Preferred Catering Partners');
    expect(content).toContain('wa.me');
    expect(content).toContain('Traditional Kerala Sadhya');
  });
});
