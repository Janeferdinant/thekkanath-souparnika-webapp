import React, { useEffect, useRef, useState } from 'react';
import { registerLens } from './lensRegistry';

/** Height of the nav bar in px (Tailwind h-20). The hero is considered "behind" the bar until it passes this line. */
export const NAV_HEIGHT_PX = 80;

type NavState = 'over-hero' | 'scrolled';

interface GlassNavigationProps {
  /** id of an element covering the hero. While it is under the bar the nav stays transparent. */
  heroSentinelId?: string;
  children: React.ReactNode;
}

/**
 * Sticky navigation bar. Transparent dark glass over the hero, firming up into burgundy glass
 * once the hero has scrolled away. Pages without a hero are always in the firm state.
 */
export const GlassNavigation: React.FC<GlassNavigationProps> = ({ heroSentinelId, children }) => {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<NavState>('scrolled');

  useEffect(() => {
    setState('scrolled');
    if (!heroSentinelId || typeof IntersectionObserver === 'undefined') return;
    const sentinel = document.getElementById(heroSentinelId);
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const latest = entries[entries.length - 1];
        if (latest) setState(latest.isIntersecting ? 'over-hero' : 'scrolled');
      },
      { rootMargin: `-${NAV_HEIGHT_PX}px 0px 0px 0px` },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [heroSentinelId]);

  // Only the transparent state sits over the photo, so only it refracts.
  useEffect(() => {
    if (state !== 'over-hero' || !ref.current) return;
    return registerLens(ref.current);
  }, [state]);

  return (
    <header
      ref={ref}
      className="glass-nav-bar"
      data-nav-state={state}
      data-glass-lens={state === 'over-hero' ? '' : undefined}
    >
      {children}
    </header>
  );
};
