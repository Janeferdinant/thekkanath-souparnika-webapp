import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, fireEvent, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PublicHeader } from '../src/components/public/PublicHeader';
import { PublicFooter } from '../src/components/public/PublicFooter';
import { FAQS, HOME_FAQ_IDS } from '../src/data/venueData';
import { HallsPage } from '../src/features/public/HallsPage';
import { HallDetailPage } from '../src/features/public/HallDetailPage';
import { FacilitiesPage } from '../src/features/public/FacilitiesPage';
import { FAQPage } from '../src/features/public/FAQPage';
import { EnquirePage } from '../src/features/public/EnquirePage';
import { ContactPage } from '../src/features/public/ContactPage';
import { GalleryPage } from '../src/features/public/GalleryPage';

const PARKING = /40\s*(?:–|-|to)\s*50/g;
const CAPACITY = /250\s*(?:–|-|to)\s*300/g;

const count = (text: string, re: RegExp): number => (text.match(re) ?? []).length;

const renderText = (ui: React.ReactElement, path = '/', routePath?: string): string => {
  const { container } = render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={routePath ?? path} element={ui} />
      </Routes>
    </MemoryRouter>,
  );
  return container.textContent ?? '';
};

describe('header and footer', () => {
  it('header top strip no longer shows the bus-route/parking phrase', () => {
    const text = renderText(<PublicHeader />);
    expect(text).not.toContain('On PWD Bus Route');
    expect(text).not.toContain('40–50 Compound Parking');
    expect(text).toContain('Nellikunnu Market Junction, Thrissur');
  });
  it('footer drops the solar/water phrase and repeated figures', () => {
    const text = renderText(<PublicFooter />);
    expect(text).not.toContain('Solar Hybrid Power');
    expect(text).not.toContain('Water Authority Tested Water');
    expect(count(text, PARKING)).toBe(0);
    expect(count(text, CAPACITY)).toBe(0);
    expect(text).toContain('Nellikunnu, Thrissur');
  });
  it('header and footer use the Hall & Events Venue descriptor', () => {
    for (const ui of [<PublicHeader />, <PublicFooter />]) {
      const text = renderText(ui);
      expect(text).toContain('Hall & Events Venue');
      expect(text).not.toContain('Auditorium & Events Venue');
    }
  });
});

it('every homepage FAQ id resolves to exactly one FAQ', () => {
  const ids = FAQS.map((f) => f.id);
  expect(new Set(ids).size).toBe(ids.length);
  expect(HOME_FAQ_IDS.map((id) => FAQS.filter((f) => f.id === id).length)).toEqual([1, 1, 1, 1]);
});

// [name, element, path, routePath, parking (exact), capacity [min, max]]
const PAGES = [
  ['Halls', <HallsPage />, '/halls', '/halls', 0, [1, 1]],
  ['Stage Hall detail', <HallDetailPage />, '/halls/stage-hall', '/halls/:slug', 0, [0, 0]],
  ['Dining Hall detail', <HallDetailPage />, '/halls/dining-hall', '/halls/:slug', 0, [0, 0]],
  ['Full venue detail', <HallDetailPage />, '/halls/auditorium', '/halls/:slug', 0, [1, 1]],
  ['Facilities', <FacilitiesPage />, '/facilities', '/facilities', 1, [0, 0]],
  ['Enquire', <EnquirePage />, '/enquire', '/enquire', 0, [1, 1]],
  ['Contact', <ContactPage />, '/contact', '/contact', 0, [0, 0]],
  ['Gallery', <GalleryPage />, '/gallery', '/gallery', 0, [0, 0]],
] as const;

describe.each(PAGES)('%s page repeated facts', (_n, ui, path, routePath, parking, [min, max]) => {
  it('shows the parking figure only where allowed', () => {
    expect(count(renderText(ui, path, routePath), PARKING)).toBe(parking);
  });
  it('shows the capacity figure at most once', () => {
    const c = count(renderText(ui, path, routePath), CAPACITY);
    expect(c).toBeGreaterThanOrEqual(min);
    expect(c).toBeLessThanOrEqual(max);
  });
});

describe('FAQ page repeated facts', () => {
  it('shows the parking and capacity figures once each once every answer is expanded', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/faq']}>
        <Routes>
          <Route path="/faq" element={<FAQPage />} />
        </Routes>
      </MemoryRouter>,
    );
    // The accordion renders only the open answer (the first one starts open).
    const headings = within(container).getAllByRole('heading', { level: 3 });
    let parking = count(container.textContent ?? '', PARKING);
    let capacity = count(container.textContent ?? '', CAPACITY);
    for (const h of headings.slice(1)) {
      fireEvent.click(h.closest('button')!);
      const text = container.textContent ?? '';
      parking += count(text, PARKING);
      capacity += count(text, CAPACITY);
    }
    expect(headings.length).toBe(FAQS.length);
    expect(parking).toBe(1);
    expect(capacity).toBe(1);
  });
});
