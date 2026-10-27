import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import {
  selectGlassTier,
  readGlassEnvironment,
  persistDowngrade,
  type GlassEnvironment,
  type GlassTier,
} from '../src/glass/capabilities';
import { GlassPerformanceManager } from '../src/glass/GlassPerformanceManager';
import { useGlassCapabilities } from '../src/glass/useGlassCapabilities';

const CAPABLE: GlassEnvironment = {
  override: null,
  supportsBackdropFilter: true,
  webgl: true,
  reducedMotion: false,
  saveData: false,
  effectiveType: '4g',
  deviceMemory: 8,
  hardwareConcurrency: 8,
  sessionDowngrade: null,
};

const ROWS: [string, Partial<GlassEnvironment>, GlassTier][] = [
  ['fully capable device', {}, 'enhanced'],
  ['valid override wins over everything', { override: 'enhanced', supportsBackdropFilter: false }, 'enhanced'],
  ['override to fallback on a capable device', { override: 'fallback' }, 'fallback'],
  ['no backdrop-filter', { supportsBackdropFilter: false }, 'fallback'],
  ['session downgrade to lite beats capability', { sessionDowngrade: 'lite' }, 'lite'],
  ['session downgrade to fallback', { sessionDowngrade: 'fallback' }, 'fallback'],
  ['no WebGL', { webgl: false }, 'lite'],
  ['reduced motion', { reducedMotion: true }, 'lite'],
  ['save-data', { saveData: true }, 'lite'],
  ['2g connection', { effectiveType: '2g' }, 'lite'],
  ['slow-2g connection', { effectiveType: 'slow-2g' }, 'lite'],
  ['3g connection is fine', { effectiveType: '3g' }, 'enhanced'],
  ['low device memory', { deviceMemory: 2 }, 'lite'],
  ['few CPU cores', { hardwareConcurrency: 2 }, 'lite'],
  ['unknown memory and cores are ignored', { deviceMemory: null, hardwareConcurrency: null }, 'enhanced'],
  ['no backdrop-filter beats reduced motion', { supportsBackdropFilter: false, reducedMotion: true }, 'fallback'],
];

describe('selectGlassTier', () => {
  it.each(ROWS)('%s', (_name, patch, expected) => {
    const { tier, reasons } = selectGlassTier({ ...CAPABLE, ...patch });
    expect(tier).toBe(expected);
    if (expected !== 'enhanced') expect(reasons.length).toBeGreaterThan(0);
  });
});

describe('readGlassEnvironment', () => {
  const win = (search: string, extra: Record<string, unknown> = {}) =>
    ({
      location: { search },
      document: { createElement: () => ({ getContext: () => null }) },
      navigator: {},
      sessionStorage: { getItem: () => null },
      ...extra,
    }) as unknown as Window;

  it('parses a valid ?glass= override', () => {
    expect(readGlassEnvironment(win('?glass=lite')).override).toBe('lite');
  });

  it('treats an invalid ?glass= value as no override', () => {
    const env = readGlassEnvironment(win('?glass=shiny'));
    expect(env.override).toBeNull();
    expect(selectGlassTier({ ...CAPABLE, override: env.override }).tier).toBe('enhanced');
  });

  it('survives sessionStorage throwing (Safari private mode, blocked storage)', () => {
    const throwing = {
      get sessionStorage(): Storage {
        throw new DOMException('denied', 'SecurityError');
      },
    };
    const w = win('', {});
    Object.defineProperty(w, 'sessionStorage', Object.getOwnPropertyDescriptor(throwing, 'sessionStorage')!);
    const env = readGlassEnvironment(w);
    expect(env.sessionDowngrade).toBeNull();
    expect(() => persistDowngrade('lite', w)).not.toThrow();
    expect(selectGlassTier(env).tier).toBeDefined();
  });

  it('reads a stored downgrade', () => {
    const w = win('', { sessionStorage: { getItem: () => 'lite' } });
    expect(readGlassEnvironment(w).sessionDowngrade).toBe('lite');
  });

  it('ignores a stored value that is not a downgrade', () => {
    const w = win('', { sessionStorage: { getItem: () => 'enhanced' } });
    expect(readGlassEnvironment(w).sessionDowngrade).toBeNull();
  });

  it('reports reduced motion and save-data from the browser', () => {
    const w = win('', {
      matchMedia: (q: string) => ({ matches: q.includes('reduce') }),
      navigator: { connection: { saveData: true, effectiveType: '2g' }, deviceMemory: 2, hardwareConcurrency: 2 },
    });
    const env = readGlassEnvironment(w);
    expect(env.reducedMotion).toBe(true);
    expect(env.saveData).toBe(true);
    expect(env.effectiveType).toBe('2g');
    expect(env.deviceMemory).toBe(2);
    expect(env.hardwareConcurrency).toBe(2);
  });
});

const Probe: React.FC = () => {
  const { tier, reasons, downgrade, reportReason } = useGlassCapabilities();
  return (
    <>
      <button data-testid="probe" onClick={() => downgrade('lite', 'slow')}>
        {tier}
      </button>
      <button data-testid="report" onClick={() => reportReason('card-refraction-disabled')}>
        report
      </button>
      <output data-testid="reasons">{reasons.join(',')}</output>
    </>
  );
};

describe('GlassPerformanceManager', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    delete document.documentElement.dataset.glassTier;
  });

  it('writes the tier onto <html data-glass-tier>', () => {
    render(
      <GlassPerformanceManager env={CAPABLE}>
        <Probe />
      </GlassPerformanceManager>,
    );
    expect(document.documentElement.dataset.glassTier).toBe('enhanced');
    expect(screen.getByTestId('probe').textContent).toBe('enhanced');
  });

  it('downgrade() updates the attribute and caches the result for the session', () => {
    render(
      <GlassPerformanceManager env={CAPABLE}>
        <Probe />
      </GlassPerformanceManager>,
    );
    act(() => screen.getByTestId('probe').click());
    expect(document.documentElement.dataset.glassTier).toBe('lite');
    expect(window.sessionStorage.getItem('ts-glass-tier')).toBe('lite');
  });

  it('never upgrades through downgrade()', () => {
    render(
      <GlassPerformanceManager env={{ ...CAPABLE, supportsBackdropFilter: false }}>
        <Probe />
      </GlassPerformanceManager>,
    );
    act(() => screen.getByTestId('probe').click());
    expect(document.documentElement.dataset.glassTier).toBe('fallback');
  });

  it('reportReason() records a note without changing the tier, once', () => {
    render(
      <GlassPerformanceManager env={CAPABLE}>
        <Probe />
      </GlassPerformanceManager>,
    );
    act(() => screen.getByTestId('report').click());
    act(() => screen.getByTestId('report').click());
    expect(screen.getByTestId('reasons').textContent).toBe('card-refraction-disabled');
    expect(document.documentElement.dataset.glassTier).toBe('enhanced');
  });

  it('falls back to a safe default outside the provider', () => {
    render(<Probe />);
    expect(screen.getByTestId('probe').textContent).toBe('lite');
  });
});
