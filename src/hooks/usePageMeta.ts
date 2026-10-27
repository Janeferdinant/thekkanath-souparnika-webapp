import { useEffect } from 'react';
import { HALLS } from '../data/venueData';
import { PAGE_META, SITE_URL, type MetaRoute } from '../data/pageMeta';

const normalise = (pathname: string): string => {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
};

function resolveMeta(path: string): { title: string; description: string } {
  if (path in PAGE_META) return PAGE_META[path as MetaRoute];

  const hallMatch = /^\/halls\/([^/]+)$/.exec(path);
  const hall = hallMatch ? HALLS.find((h) => h.slug === hallMatch[1]) : undefined;
  if (hall) return { title: `${hall.name} — Thekkanath Souparnika`, description: hall.description };

  return PAGE_META['/'];
}

/** Finds the one tag matching `selector` in <head>, creating it if the page does not have it yet. */
function ensureHeadTag(selector: string, create: () => HTMLElement): HTMLElement {
  const existing = document.head.querySelector<HTMLElement>(selector);
  if (existing) return existing;
  const el = create();
  document.head.appendChild(el);
  return el;
}

/**
 * Keeps the document title, meta description and canonical link in step with the current public
 * route. This is a single-page app, so it updates the tags that index.html ships rather than adding more.
 */
export function usePageMeta(pathname: string): void {
  useEffect(() => {
    const path = normalise(pathname);
    const { title, description } = resolveMeta(path);

    document.title = title;

    const descriptionTag = ensureHeadTag('meta[name="description"]', () => {
      const el = document.createElement('meta');
      el.setAttribute('name', 'description');
      return el;
    });
    descriptionTag.setAttribute('content', description);

    const canonicalTag = ensureHeadTag('link[rel="canonical"]', () => {
      const el = document.createElement('link');
      el.setAttribute('rel', 'canonical');
      return el;
    });
    canonicalTag.setAttribute('href', path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`);
  }, [pathname]);
}
