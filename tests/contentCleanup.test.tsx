import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PublicHeader } from '../src/components/public/PublicHeader';
import { PublicFooter } from '../src/components/public/PublicFooter';

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
