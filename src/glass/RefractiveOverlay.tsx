import React, { useEffect, useRef, useState } from 'react';
import { getCardRenderer, onCardRendererDisabled } from './renderer/cardRefraction';
import { useGlassCapabilities } from './useGlassCapabilities';

interface RefractiveOverlayProps {
  /** The photo this label sits on. */
  imageRef: React.RefObject<HTMLImageElement>;
  className?: string;
  children: React.ReactNode;
}

/** How long to wait after a hover starts or ends for the photo's zoom transition to settle. */
const HOVER_SETTLE_MS = 750;

/**
 * A label on a photo (a badge, a caption chip). On an enhanced device it draws the photo behind
 * itself with a refracted rim, once when its card scrolls into view and again after a hover
 * settles; it never animates and never runs while off-screen. On every other device, or if the
 * shared renderer is unavailable or over budget, it is simply the plain translucent chip.
 */
export const RefractiveOverlay: React.FC<RefractiveOverlayProps> = ({ imageRef, className, children }) => {
  const { tier, reportReason } = useGlassCapabilities();
  const reportRef = useRef(reportReason);
  reportRef.current = reportReason;

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (tier !== 'enhanced' || !getCardRenderer()) {
      setActive(false);
      return;
    }
    setActive(true);
    return onCardRendererDisabled(() => {
      setActive(false);
      reportRef.current('card-refraction-disabled');
    });
  }, [tier]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!active || !wrap) return;

    let drawn = false;
    const timers = new Set<number>();

    const draw = () => {
      const canvas = canvasRef.current;
      const image = imageRef.current;
      if (!canvas || !image || !image.complete || image.naturalWidth === 0) return;
      const renderer = getCardRenderer();
      if (!renderer) {
        setActive(false);
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.5 : 2);
      const area = image.getBoundingClientRect();
      const box = wrap.getBoundingClientRect();
      if (area.width <= 0 || area.height <= 0 || box.width <= 0 || box.height <= 0) return;

      const left = box.left - area.left;
      const top = box.top - area.top;
      canvas.width = Math.round(box.width * dpr);
      canvas.height = Math.round(box.height * dpr);

      const radius = parseFloat(getComputedStyle(wrap).borderTopLeftRadius) || 0;
      const lens = Float32Array.of(left * dpr, (area.height - top - box.height) * dpr, box.width * dpr, box.height * dpr, radius * dpr);
      renderer.renderTo(canvas, image, lens, {
        width: Math.round(area.width * dpr),
        height: Math.round(area.height * dpr),
        cropX: Math.round(left * dpr),
        cropY: Math.round(top * dpr),
      });
      canvas.style.opacity = '1';
      drawn = true;
    };

    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
    };

    const cleanups: (() => void)[] = [];

    // draw once when the card first scrolls into view
    let inViewOnce = false;
    const tryFirstDraw = () => {
      if (!inViewOnce || drawn) return;
      draw();
    };
    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver((entries) => {
        const latest = entries[entries.length - 1];
        if (latest?.isIntersecting && !inViewOnce) {
          inViewOnce = true;
          tryFirstDraw();
        }
      });
      observer.observe(wrap);
      cleanups.push(() => observer.disconnect());
    } else {
      inViewOnce = true;
      tryFirstDraw();
    }

    // the photo may still be loading when the card appears
    const image = imageRef.current;
    if (image) {
      const onLoad = () => tryFirstDraw();
      image.addEventListener('load', onLoad);
      cleanups.push(() => image.removeEventListener('load', onLoad));
    }

    // static between triggers: redraw only after a hover settles or the window is resized
    const card = wrap.closest('.group');
    if (card) {
      const onHover = () => later(() => drawn && draw(), HOVER_SETTLE_MS);
      card.addEventListener('pointerenter', onHover);
      card.addEventListener('pointerleave', onHover);
      cleanups.push(() => {
        card.removeEventListener('pointerenter', onHover);
        card.removeEventListener('pointerleave', onHover);
      });
    }
    const onResize = () => later(() => drawn && draw(), 150);
    window.addEventListener('resize', onResize, { passive: true });
    cleanups.push(() => window.removeEventListener('resize', onResize));

    return () => {
      cleanups.forEach((fn) => fn());
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [active, imageRef]);

  return (
    <div
      ref={wrapRef}
      data-refractive-overlay=""
      data-refracting={active ? '' : undefined}
      className={['refractive-overlay', className].filter(Boolean).join(' ')}
    >
      {active && <canvas ref={canvasRef} aria-hidden="true" />}
      {children}
    </div>
  );
};
