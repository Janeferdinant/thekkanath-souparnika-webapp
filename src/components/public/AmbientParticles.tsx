import { useEffect, useRef } from 'react';

interface AmbientParticlesProps {
  className?: string;
  count?: number;
  variant?: 'global' | 'hero';
}

type Particle = { x: number; y: number; r: number; speed: number; alpha: number; phase: number };

/** Decorative hero dust. It never covers or changes the source photograph. */
export function AmbientParticles({ className = '', count, variant = 'hero' }: AmbientParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !host || !ctx) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 650px)');
    let width = 0, height = 0, frame = 0, last = 0;
    let particles: Particle[] = [];

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const amount = Math.min(count ?? (mobile.matches ? 12 : 28), mobile.matches ? 12 : 28);
      particles = Array.from({ length: variant === 'hero' ? amount : Math.min(amount, 12) }, () => ({
        x: Math.random() * width, y: Math.random() * height, r: .5 + Math.random() * 1.4,
        speed: .05 + Math.random() * .11, alpha: .12 + Math.random() * .28, phase: Math.random() * 10,
      }));
    };
    const tick = (time: number) => {
      frame = requestAnimationFrame(tick);
      if (time - last < 28) return;
      const delta = Math.min(time - last || 28, 50);
      last = time;
      ctx.clearRect(0, 0, width, height);
      for (const dot of particles) {
        dot.y -= dot.speed * delta;
        if (dot.y < 0) { dot.y = height; dot.x = Math.random() * width; }
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,207,168,${dot.alpha * (.8 + .2 * Math.sin(time * .0007 + dot.phase))})`;
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    const stop = () => { cancelAnimationFrame(frame); frame = 0; ctx.clearRect(0, 0, width, height); };
    const start = () => { if (frame || document.hidden || motion.matches) return; last = performance.now(); frame = requestAnimationFrame(tick); };
    const onVisibility = () => document.hidden ? stop() : start();
    const onMotion = () => motion.matches ? stop() : start();
    const onResize = () => { resize(); };
    resize(); start();
    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    motion.addEventListener('change', onMotion);
    return () => { stop(); window.removeEventListener('resize', onResize); document.removeEventListener('visibilitychange', onVisibility); motion.removeEventListener('change', onMotion); };
  }, [count, variant]);

  return <canvas ref={canvasRef} className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden="true" />;
}
