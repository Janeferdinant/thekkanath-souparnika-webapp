// Generates responsive AVIF/WebP/JPEG derivatives and src/data/imageManifest.json.
// Resizing only: no colour operations, no upscaling. Run with `npm run images`;
// outputs are committed so the Vercel build never needs sharp.
import sharp from 'sharp';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';

const OUT = 'public/assets/venue';
const QUALITY = { avif: 55, webp: 78, jpg: 82 };

const HERO = {
  key: 'hero-entrance',
  src: 'assets-src/venue/golden-hour-entrance.png',
  widths: [480, 768, 1086],
  dir: 'hero',
  prefix: 'entrance',
  alt: 'Thekkanath Souparnika entrance and building facade at golden hour, Thrissur',
};

const VENUE_ALTS = [
  'Stage Hall with raised carpeted stage and cushioned seating',
  'Welcome Hall with front glass entrance and side seating',
  'Dining Hall with banquet tables and a tree outlook',
  'Open Hall with polished marble flooring and airflow fans',
  'Wash area with a long row of basins and mirrors',
  'Grand staircase with glass railings',
  'Thekkanath Souparnika building facade and compound',
];
const VENUE_WIDTHS = [640, 1024];

const encode = (img, format) => {
  if (format === 'avif') return img.avif({ quality: QUALITY.avif });
  if (format === 'webp') return img.webp({ quality: QUALITY.webp });
  return img.jpeg({ quality: QUALITY.jpg, mozjpeg: true });
};

async function build({ key, src, widths, dir, prefix, alt }) {
  const meta = await sharp(src).metadata();
  const usable = [...new Set(widths.filter((w) => w <= meta.width).concat(widths.includes(meta.width) ? [] : [meta.width]))].sort((a, b) => a - b);
  mkdirSync(`${OUT}/${dir}`, { recursive: true });
  const srcsets = { avif: [], webp: [], jpg: [] };
  for (const w of usable) {
    for (const format of ['avif', 'webp', 'jpg']) {
      const file = `${OUT}/${dir}/${prefix}-${w}.${format}`;
      await encode(sharp(src).resize({ width: w, withoutEnlargement: true }), format).toFile(file);
      srcsets[format].push(`/assets/venue/${dir}/${prefix}-${w}.${format} ${w}w`);
    }
  }
  const largest = usable[usable.length - 1];
  return {
    width: meta.width,
    height: meta.height,
    alt,
    avif: srcsets.avif.join(', '),
    webp: srcsets.webp.join(', '),
    jpg: srcsets.jpg.join(', '),
    fallback: `/assets/venue/${dir}/${prefix}-${largest}.jpg`,
  };
}

const manifest = {};
manifest[HERO.key] = await build(HERO);

for (let i = 0; i < 7; i++) {
  const n = String(i).padStart(3, '0');
  const src = `${OUT}/venue-${n}.jpg`;
  if (!existsSync(src)) throw new Error(`missing ${src}`);
  const { width } = await sharp(src).metadata();
  manifest[`venue-${n}`] = await build({
    key: `venue-${n}`,
    src,
    widths: [...VENUE_WIDTHS.filter((w) => w < width), width],
    dir: 'opt',
    prefix: `venue-${n}`,
    alt: VENUE_ALTS[i],
  });
}

// Open Graph image: signage and entrance, cropped from the full photo (no resize, no grading).
mkdirSync(`${OUT}/og`, { recursive: true });
await sharp(HERO.src)
  .extract({ left: 0, top: 300, width: 1086, height: 570 })
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile(`${OUT}/og/entrance-og.jpg`);

writeFileSync('src/data/imageManifest.json', JSON.stringify(manifest, null, 2) + '\n');
console.log(`wrote ${Object.keys(manifest).length} manifest entries and the OG image`);
