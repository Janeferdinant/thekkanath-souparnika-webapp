import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Public UI - Preferred caterers card', () => {
  it('implements PreferredCaterersCard with WhatsApp action links and cuisine tags', () => {
    const catererCardPath = path.resolve(__dirname, '../src/components/public/PreferredCaterersCard.tsx');
    expect(fs.existsSync(catererCardPath)).toBe(true);

    const content = fs.readFileSync(catererCardPath, 'utf-8');
    expect(content).toContain('Preferred Catering Partners');
    expect(content).toContain('wa.me');
    expect(content).toContain('Traditional Kerala Sadhya');
  });
});
