import { useEffect } from 'react';
import type { GlassTier } from './capabilities';

/** Pointer lighting is a desktop-only flourish: enhanced tier, a fine pointer, motion allowed. */
export function pointerLightAllowed(tier: GlassTier): boolean {
  if (tier !== 'enhanced' || typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Writes the pointer position over `ref` as `--glass-light-x/y` (0 to 1), coalesced to one
 * update per animation frame. Attaches nothing unless `enabled`.
 */
export function usePointerLight(ref: React.RefObject<HTMLElement>, enabled: boolean): void {
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;

    let frame = 0;
    let last: PointerEvent | null = null;

    const apply = () => {
      frame = 0;
      if (!last) return;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const x = Math.min(1, Math.max(0, (last.clientX - rect.left) / rect.width));
      const y = Math.min(1, Math.max(0, (last.clientY - rect.top) / rect.height));
      el.style.setProperty('--glass-light-x', String(+x.toFixed(3)));
      el.style.setProperty('--glass-light-y', String(+y.toFixed(3)));
    };
    const onMove = (e: PointerEvent) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    el.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      el.removeEventListener('pointermove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref, enabled]);
}
