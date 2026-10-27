import { useEffect, useRef } from 'react';
import { createHeroRenderer } from './webgl';
import { assessFrameTimes, MIN_FRAME_SAMPLES } from './frameBudget';
import { toLensUniforms, type LensRect } from './lensUniforms';
import { getLenses, subscribe } from '../lensRegistry';
import { useGlassCapabilities } from '../useGlassCapabilities';

interface HeroRefractionProps {
  frame: HTMLElement;
  image: HTMLImageElement;
}

/** Longest the first-render measurement may run before an unresponsive device is treated as slow. */
const MEASURE_TIMEOUT_MS = 1500;

/**
 * Mounts a decorative canvas over the hero photo and refracts the photo inside registered lens
 * elements (the info panel, the navigation while it overlaps the photo). The DOM <img> stays
 * underneath as the LCP element and fallback; text is DOM above the canvas and is never distorted.
 *
 * There is no render loop. A frame is drawn only when something changes: the frame resizes, a lens
 * appears or disappears, the page scrolls while the hero is on screen, or the pointer moves.
 * The first frames are timed once; a slow device is downgraded to the lite tier.
 */
const HeroRefraction: React.FC<HeroRefractionProps> = ({ frame, image }) => {
  const { downgrade } = useGlassCapabilities();
  const downgradeRef = useRef(downgrade);
  downgradeRef.current = downgrade;

  useEffect(() => {
    // The canvas is created here, not in JSX, so a remount (React StrictMode in development) gets a
    // fresh canvas and therefore a fresh WebGL context.
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;opacity:0;transition:opacity 0.6s ease;';
    frame.appendChild(canvas);

    const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.5 : 2);

    let alive = true;
    let inView = true;
    let frameRequest = 0;
    let light: [number, number] = [0.3, 0.2];
    let shown = false;
    const marked = new Set<HTMLElement>();

    const cleanups: (() => void)[] = [];
    const teardown = () => {
      if (!alive) return;
      alive = false;
      if (frameRequest) cancelAnimationFrame(frameRequest);
      cleanups.forEach((fn) => fn());
      marked.forEach((el) => el.removeAttribute('data-glass-refracting'));
      marked.clear();
      canvas.remove();
    };

    const fail = (reason: string) => {
      downgradeRef.current('lite', reason);
      teardown();
    };

    const renderer = createHeroRenderer(canvas, image, { dpr, onFailure: fail });
    if (!renderer) {
      // onFailure already ran and removed the canvas; nothing to clean up
      return teardown;
    }
    cleanups.push(() => renderer.destroy());

    const sizeCanvas = () => {
      const r = frame.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return;
      renderer.resize(Math.round(r.width * dpr), Math.round(r.height * dpr));
    };

    const lensRects = (): LensRect[] =>
      getLenses().map((el) => {
        const r = el.getBoundingClientRect() as LensRect;
        r.radius = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
        return r;
      });

    /** Keeps the lenses' refracting flag in step with the registry so their CSS can let the canvas show through. */
    const syncMarks = () => {
      const current = new Set(getLenses());
      marked.forEach((el) => {
        if (!current.has(el)) {
          el.removeAttribute('data-glass-refracting');
          marked.delete(el);
        }
      });
      current.forEach((el) => {
        if (!marked.has(el)) {
          el.setAttribute('data-glass-refracting', '');
          marked.add(el);
        }
      });
    };

    const draw = () => {
      renderer.render(toLensUniforms(lensRects(), frame.getBoundingClientRect(), dpr), light);
      if (!shown) {
        shown = true;
        canvas.style.opacity = '1';
      }
    };

    const canRender = () => alive && inView && !document.hidden;

    const schedule = () => {
      if (!canRender() || frameRequest || measuring) return;
      frameRequest = requestAnimationFrame(() => {
        frameRequest = 0;
        if (canRender()) draw();
      });
    };

    // --- the one bounded performance check, taken from the first real renders --------------------
    let measuring = true;
    const samples: number[] = [];
    let previous = 0;
    let started = 0;

    const finishMeasuring = () => {
      measuring = false;
      const verdict = assessFrameTimes(samples);
      // Too few frames in the allowed time on a visible page means the device cannot keep up.
      if (verdict === 'slow' || (verdict === 'insufficient' && !document.hidden)) {
        fail('frame-budget');
        return;
      }
      syncMarks();
    };

    const measureFrame = (now: number) => {
      frameRequest = 0;
      if (!alive) return;
      if (!started) started = now;
      if (previous) samples.push(now - previous);
      previous = now;
      draw();
      syncMarks();
      if (samples.length >= MIN_FRAME_SAMPLES + 1 || now - started > MEASURE_TIMEOUT_MS) {
        finishMeasuring();
      } else {
        frameRequest = requestAnimationFrame(measureFrame);
      }
    };

    // --- what triggers a frame -------------------------------------------------------------------
    sizeCanvas();

    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(() => {
        sizeCanvas();
        schedule();
      });
      resizeObserver.observe(frame);
      cleanups.push(() => resizeObserver.disconnect());
    }

    if (typeof IntersectionObserver !== 'undefined') {
      const visibility = new IntersectionObserver((entries) => {
        const latest = entries[entries.length - 1];
        const wasInView = inView;
        inView = latest ? latest.isIntersecting : true;
        if (inView && !wasInView) schedule();
      });
      visibility.observe(frame);
      cleanups.push(() => visibility.disconnect());
    }

    const onScroll = () => schedule();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    cleanups.push(() => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    });

    const onVisibility = () => {
      if (!document.hidden) schedule();
    };
    document.addEventListener('visibilitychange', onVisibility);
    cleanups.push(() => document.removeEventListener('visibilitychange', onVisibility));

    cleanups.push(
      subscribe(() => {
        syncMarks();
        schedule();
      }),
    );

    const finePointer = typeof window.matchMedia === 'function' && window.matchMedia('(pointer: fine)').matches;
    if (finePointer) {
      const onPointer = (e: PointerEvent) => {
        const r = frame.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        light = [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height];
        schedule();
      };
      frame.addEventListener('pointermove', onPointer, { passive: true });
      cleanups.push(() => frame.removeEventListener('pointermove', onPointer));
    }

    frameRequest = requestAnimationFrame(measureFrame);

    return teardown;
  }, [frame, image]);

  return null;
};

export default HeroRefraction;
