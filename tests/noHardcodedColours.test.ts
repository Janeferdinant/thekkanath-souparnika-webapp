import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Public files still using hard-coded colour literals. Each page-migration task removes its
 * files from this list; the list must reach [] before the PR is done.
 */
export const PENDING_MIGRATION: string[] = [
  'src/components/public/AmbientParticles.tsx',
  'src/components/public/PreferredCaterersCard.tsx',
  'src/components/public/PublicFooter.tsx',
  'src/components/public/PublicHeader.tsx',
  'src/components/public/PublicLayout.tsx',
  'src/features/public/ContactPage.tsx',
  'src/features/public/EnquirePage.tsx',
  'src/features/public/FAQPage.tsx',
  'src/features/public/FacilitiesPage.tsx',
  'src/features/public/GalleryPage.tsx',
  'src/features/public/HallDetailPage.tsx',
  'src/features/public/HallsPage.tsx',
  'src/features/public/HomePage.tsx',
];

const COLOUR = /#[0-9a-fA-F]{3,8}\b|rgba?\(/;

const walk = (dir: string): string[] => {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name).replaceAll('\\', '/');
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
};

const files = [...walk('src/features/public'), ...walk('src/components/public'), ...walk('src/glass')].filter((f) => f.endsWith('.tsx'));

describe('public files use brand tokens, not colour literals', () => {
  it('has no hard-coded colours outside the pending list', () => {
    const offenders = files.filter((f) => !PENDING_MIGRATION.includes(f) && COLOUR.test(readFileSync(f, 'utf8')));
    expect(offenders).toEqual([]);
  });

  it('every pending entry still exists and still has a literal', () => {
    for (const f of PENDING_MIGRATION) {
      expect(existsSync(f), `${f} no longer exists; remove it from PENDING_MIGRATION`).toBe(true);
      expect(COLOUR.test(readFileSync(f, 'utf8')), `${f} is clean; remove it from PENDING_MIGRATION`).toBe(true);
    }
  });
});
