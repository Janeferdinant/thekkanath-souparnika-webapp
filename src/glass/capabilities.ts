export type GlassTier = 'enhanced' | 'lite' | 'fallback';

export const GLASS_TIERS: readonly GlassTier[] = ['enhanced', 'lite', 'fallback'];
export const TIER_STORAGE_KEY = 'ts-glass-tier';

export interface GlassEnvironment {
  override: GlassTier | null;
  supportsBackdropFilter: boolean;
  webgl: boolean;
  reducedMotion: boolean;
  saveData: boolean;
  effectiveType: string | null;
  deviceMemory: number | null;
  hardwareConcurrency: number | null;
  sessionDowngrade: GlassTier | null;
}

const isTier = (v: unknown): v is GlassTier => typeof v === 'string' && (GLASS_TIERS as readonly string[]).includes(v);

/** Decides the rendering tier from capabilities. Pure; user-agent strings are never consulted. */
export function selectGlassTier(env: GlassEnvironment): { tier: GlassTier; reasons: string[] } {
  if (env.override) return { tier: env.override, reasons: ['override'] };
  if (!env.supportsBackdropFilter) return { tier: 'fallback', reasons: ['no-backdrop-filter'] };
  if (env.sessionDowngrade) return { tier: env.sessionDowngrade, reasons: ['session-downgrade'] };

  const reasons: string[] = [];
  if (!env.webgl) reasons.push('no-webgl');
  if (env.reducedMotion) reasons.push('reduced-motion');
  if (env.saveData) reasons.push('save-data');
  if (env.effectiveType === 'slow-2g' || env.effectiveType === '2g') reasons.push('slow-connection');
  if (env.deviceMemory !== null && env.deviceMemory < 4) reasons.push('low-memory');
  if (env.hardwareConcurrency !== null && env.hardwareConcurrency < 4) reasons.push('few-cores');
  return reasons.length ? { tier: 'lite', reasons } : { tier: 'enhanced', reasons: [] };
}

const safely = <T>(fn: () => T, fallback: T): T => {
  try {
    return fn();
  } catch {
    return fallback;
  }
};

interface NetworkInformationLike {
  saveData?: boolean;
  effectiveType?: string;
}
type NavigatorWithHints = Navigator & {
  connection?: NetworkInformationLike;
  deviceMemory?: number;
};

/** Reads the browser's capabilities. Never throws; anything unreadable counts as unknown. */
export function readGlassEnvironment(win: Window): GlassEnvironment {
  const nav = safely(() => win.navigator as NavigatorWithHints, {} as NavigatorWithHints);
  const requested = safely(() => new URLSearchParams(win.location.search).get('glass'), null);

  const supportsBackdropFilter = safely(() => {
    const css = (win as Window & { CSS?: { supports?: (prop: string, value: string) => boolean } }).CSS;
    return Boolean(css?.supports?.('backdrop-filter', 'blur(1px)') || css?.supports?.('-webkit-backdrop-filter', 'blur(1px)'));
  }, false);

  const webgl = safely(() => {
    const canvas = win.document.createElement('canvas');
    const gl = canvas.getContext('webgl') as WebGLRenderingContext | null;
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  }, false);

  const stored = safely(() => win.sessionStorage.getItem(TIER_STORAGE_KEY), null);

  return {
    override: isTier(requested) ? requested : null,
    supportsBackdropFilter,
    webgl,
    reducedMotion: safely(() => Boolean(win.matchMedia?.('(prefers-reduced-motion: reduce)').matches), false),
    saveData: safely(() => Boolean(nav.connection?.saveData), false),
    effectiveType: safely(() => nav.connection?.effectiveType ?? null, null),
    deviceMemory: safely(() => (typeof nav.deviceMemory === 'number' ? nav.deviceMemory : null), null),
    hardwareConcurrency: safely(() => (typeof nav.hardwareConcurrency === 'number' ? nav.hardwareConcurrency : null), null),
    sessionDowngrade: stored === 'lite' || stored === 'fallback' ? stored : null,
  };
}

/** Remembers a downgrade for the rest of the session so it is never re-measured. */
export function persistDowngrade(tier: GlassTier, win: Window): void {
  try {
    win.sessionStorage.setItem(TIER_STORAGE_KEY, tier);
  } catch {
    /* storage blocked: the downgrade still applies for this page view */
  }
}
