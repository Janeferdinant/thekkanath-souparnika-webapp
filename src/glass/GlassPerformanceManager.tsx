import React, { createContext, useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
  GLASS_TIERS,
  persistDowngrade,
  readGlassEnvironment,
  selectGlassTier,
  type GlassEnvironment,
  type GlassTier,
} from './capabilities';

export interface GlassCapabilities {
  tier: GlassTier;
  reasons: string[];
  pageVisible: boolean;
  downgrade(to: GlassTier, reason: string): void;
}

/** Outside a provider (tests, isolated components) glass renders as the safe middle tier. */
export const GlassContext = createContext<GlassCapabilities>({
  tier: 'lite',
  reasons: [],
  pageVisible: true,
  downgrade: () => undefined,
});

const rank = (t: GlassTier) => GLASS_TIERS.indexOf(t);

interface Props {
  children: React.ReactNode;
  /** Injected environment (tests). Defaults to reading the real browser once. */
  env?: GlassEnvironment;
}

export const GlassPerformanceManager: React.FC<Props> = ({ children, env }) => {
  const [baseEnv] = useState<GlassEnvironment>(() => env ?? readGlassEnvironment(window));
  const [downgraded, setDowngraded] = useState<{ tier: GlassTier; reason: string } | null>(null);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);

  const { tier, reasons } = useMemo(() => {
    const selected = selectGlassTier(baseEnv);
    if (downgraded && !baseEnv.override && rank(downgraded.tier) > rank(selected.tier)) {
      return { tier: downgraded.tier, reasons: [...selected.reasons, downgraded.reason] };
    }
    return selected;
  }, [baseEnv, downgraded]);

  useLayoutEffect(() => {
    document.documentElement.dataset.glassTier = tier;
  }, [tier]);

  useEffect(() => {
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const downgrade = useCallback((to: GlassTier, reason: string) => {
    if (to === 'enhanced') return;
    persistDowngrade(to, window);
    setDowngraded((prev) => (prev && rank(prev.tier) >= rank(to) ? prev : { tier: to, reason }));
  }, []);

  const value = useMemo(() => ({ tier, reasons, pageVisible, downgrade }), [tier, reasons, pageVisible, downgrade]);
  return <GlassContext.Provider value={value}>{children}</GlassContext.Provider>;
};
