import { describe, it, expect, afterEach } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { act, render } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { PublicLayout } from '../src/components/public/PublicLayout';
import { PAGE_META, SITE_URL } from '../src/data/pageMeta';
import { HALLS, VENUE_INFO } from '../src/data/venueData';

const html = readFileSync('index.html', 'utf8');
const meta = (attr: 'name' | 'property', key: string): string | null => {
  const m = new RegExp(`<meta\\s+${attr}="${key}"\\s+content="([^"]*)"`, 'i').exec(html);
  return m ? m[1] : null;
};

describe('index.html social and search metadata', () => {
  it('has a canonical link to the production home page', () => {
    expect(html).toContain(`<link rel="canonical" href="${SITE_URL}/" />`);
  });

  it('has Open Graph tags that point at an image which exists in public/', () => {
    expect(meta('property', 'og:type')).toBe('website');
    expect(meta('property', 'og:site_name')).toBe('Thekkanath Souparnika');
    expect(meta('property', 'og:url')).toBe(`${SITE_URL}/`);
    expect(meta('property', 'og:title')).toBeTruthy();
    expect(meta('property', 'og:description')).toBeTruthy();
    const image = meta('property', 'og:image')!;
    expect(image.startsWith(`${SITE_URL}/`)).toBe(true);
    expect(existsSync('public' + image.slice(SITE_URL.length))).toBe(true);
    expect(meta('property', 'og:image:alt')).toBeTruthy();
  });

  it('has a large-image Twitter card using the same image', () => {
    expect(meta('name', 'twitter:card')).toBe('summary_large_image');
    expect(meta('name', 'twitter:image')).toBe(meta('property', 'og:image'));
    expect(meta('name', 'twitter:title')).toBeTruthy();
  });

  it('keeps the original title and description wording for the home page', () => {
    expect(html).toContain('<title>Thekkanath Souparnika — Hall & Events Venue, Thrissur</title>');
    expect(PAGE_META['/'].title).toBe('Thekkanath Souparnika — Hall & Events Venue, Thrissur');
    expect(meta('name', 'description')).toBe(PAGE_META['/'].description);
  });
});

describe('EventVenue JSON-LD', () => {
  const block = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(html);
  const data = block ? JSON.parse(block[1]) : null;

  it('is present and valid JSON', () => {
    expect(block).not.toBeNull();
    expect(data['@context']).toBe('https://schema.org');
  });

  it('describes an EventVenue with only confirmed facts', () => {
    expect(data['@type']).toBe('EventVenue');
    expect(data.name).toBe(VENUE_INFO.name);
    expect(data.url).toBe(`${SITE_URL}/`);
    expect(data.image).toBe(meta('property', 'og:image'));
    expect(data.email).toBe(VENUE_INFO.email);
    expect(data.maximumAttendeeCapacity).toBe(400);
    expect(data.address['@type']).toBe('PostalAddress');
    expect(data.address.postalCode).toBe(VENUE_INFO.address.pincode);
    expect(data.address.addressRegion).toBe(VENUE_INFO.address.state);
    expect(data.address.streetAddress).toContain(VENUE_INFO.address.street);
  });

  it('lists only the venue phone numbers', () => {
    const phones = [].concat(data.telephone);
    expect(phones.length).toBe(VENUE_INFO.displayPhones.length);
    for (const phone of phones) expect(VENUE_INFO.displayPhones).toContain(phone);
  });

  it('claims nothing we cannot back: no coordinates, ratings or price range', () => {
    for (const key of ['geo', 'aggregateRating', 'review', 'priceRange', 'openingHours', 'openingHoursSpecification']) {
      expect(data[key], key).toBeUndefined();
    }
  });
});

describe('Google Fonts request', () => {
  const href = /href="(https:\/\/fonts\.googleapis\.com\/css2[^"]+)"/.exec(html)![1];

  it('asks only for the two families, with swap', () => {
    expect(href).toContain('family=Cormorant+Garamond');
    expect(href).toContain('family=Inter');
    expect(href).toContain('display=swap');
  });

  it('loads only the Cormorant weights that actually render, and no italics', () => {
    // 300/400/500 all render as 400 and 700 renders as 700; 600 and the italics are never used
    expect(href).toContain('Cormorant+Garamond:wght@400;700');
    expect(href).not.toMatch(/Cormorant\+Garamond:ital/);
  });

  it('does not block first paint: loaded as a preloaded stylesheet, with a no-script fallback', () => {
    // a render-blocking font stylesheet delays the first paint of everything; text shows in the system
    // font first and swaps (font-display: swap) once the fonts arrive
    expect(html).toMatch(/<link\s+rel="preload"\s+as="style"\s+href="https:\/\/fonts\.googleapis\.com\/css2[^"]+"\s+onload="this\.onload=null;this\.rel='stylesheet'"/);
    expect(html).toMatch(/<noscript>\s*<link\s+rel="stylesheet"\s+href="https:\/\/fonts\.googleapis\.com\/css2[^"]+"\s*\/?>\s*<\/noscript>/);
    expect(html).not.toMatch(/<link\s+href="https:\/\/fonts\.googleapis\.com\/css2[^"]+"\s+rel="stylesheet"/);
  });

  it('keeps every Inter weight the site uses', () => {
    expect(href).toContain('Inter:wght@300;400;500;600;700');
  });

  it('guards the trim: no italic or serif semibold class has been introduced since', () => {
    const walk = (dir: string): string[] =>
      readdirSync(dir).flatMap((n) => {
        const p = join(dir, n);
        return statSync(p).isDirectory() ? walk(p) : [p];
      });
    const sources = walk('src').filter((f) => /\.tsx$/.test(f));
    const offenders: string[] = [];
    for (const file of sources) {
      const text = readFileSync(file, 'utf8');
      for (const m of text.matchAll(/class(?:Name)?=(?:"([^"]*)"|\{`([^`]*)`\})/g)) {
        const cls = (m[1] ?? m[2] ?? '').split(/\s+/);
        if (cls.includes('italic')) offenders.push(`${file}: italic`);
        if (cls.includes('font-serif') && cls.includes('font-semibold')) offenders.push(`${file}: serif semibold`);
      }
    }
    expect(offenders, 'add the missing font weight/style to index.html if this is intended').toEqual([]);
  });
});

describe('PAGE_META', () => {
  const routes = ['/', '/halls', '/facilities', '/gallery', '/enquire', '/contact', '/faq'] as const;

  it.each(routes)('%s has a sensible title and description', (route) => {
    const { title, description } = PAGE_META[route];
    expect(title.length).toBeGreaterThan(10);
    expect(title.length).toBeLessThanOrEqual(70);
    expect(description.length).toBeGreaterThan(50);
    expect(description.length).toBeLessThanOrEqual(180); // the original home description (kept as is) is 178
  });

  it('never repeats the parking or capacity figures in descriptions', () => {
    for (const route of routes) {
      expect(PAGE_META[route].description).not.toMatch(/40\s*(?:–|-|to)\s*50|250\s*(?:–|-|to)\s*300/);
    }
  });

  it('gives every page its own title', () => {
    const titles = routes.map((r) => PAGE_META[r].title);
    expect(new Set(titles).size).toBe(titles.length);
  });
});

describe('per-route meta in PublicLayout', () => {
  afterEach(() => {
    document.title = '';
    document.head.querySelectorAll('meta[name="description"], link[rel="canonical"]').forEach((el) => el.remove());
  });

  const renderAt = (path: string) => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <PublicLayout />,
          children: [
            { index: true, element: <div>home</div> },
            { path: 'halls', element: <div>halls</div> },
            { path: 'halls/:slug', element: <div>hall</div> },
            { path: 'enquire', element: <div>enquire</div> },
          ],
        },
      ],
      { initialEntries: [path] },
    );
    return render(<RouterProvider router={router} />);
  };

  const canonical = () => document.head.querySelector('link[rel="canonical"]')?.getAttribute('href');
  const description = () => document.head.querySelector('meta[name="description"]')?.getAttribute('content');

  it('sets title, description and canonical for /halls', () => {
    renderAt('/halls');
    expect(document.title).toBe(PAGE_META['/halls'].title);
    expect(description()).toBe(PAGE_META['/halls'].description);
    expect(canonical()).toBe('https://www.thekkanathsouparnika.com/halls');
  });

  it('uses the home page values and a trailing-slash canonical for /', () => {
    renderAt('/');
    expect(document.title).toBe(PAGE_META['/'].title);
    expect(canonical()).toBe('https://www.thekkanathsouparnika.com/');
  });

  it('names the hall on a hall page and uses its description', () => {
    const hall = HALLS.find((h) => h.slug === 'stage-hall')!;
    renderAt('/halls/stage-hall');
    expect(document.title).toBe(`${hall.name} — Thekkanath Souparnika`);
    expect(description()).toBe(hall.description);
    expect(canonical()).toBe('https://www.thekkanathsouparnika.com/halls/stage-hall');
  });

  it('updates when the route changes without leaving duplicate tags behind', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <PublicLayout />,
          children: [
            { index: true, element: <div>home</div> },
            { path: 'enquire', element: <div>enquire</div> },
          ],
        },
      ],
      { initialEntries: ['/'] },
    );
    render(<RouterProvider router={router} />);
    expect(document.title).toBe(PAGE_META['/'].title);

    await act(async () => {
      await router.navigate('/enquire');
    });

    expect(document.title).toBe(PAGE_META['/enquire'].title);
    expect(canonical()).toBe('https://www.thekkanathsouparnika.com/enquire');
    expect(document.head.querySelectorAll('link[rel="canonical"]').length).toBe(1);
    expect(document.head.querySelectorAll('meta[name="description"]').length).toBe(1);
  });
});
