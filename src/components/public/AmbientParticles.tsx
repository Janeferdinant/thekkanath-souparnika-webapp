import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  alphaSpeed: number;
  color: string;
}

interface AmbientParticlesProps {
  className?: string;
  count?: number;
  variant?: 'global' | 'hero';
}

export const AmbientParticles: React.FC<AmbientParticlesProps> = ({
  className = 'pointer-events-none z-0',
  count,
  variant = 'hero',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // 1. Accessibility guard: Check for reduced motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return; // Respect accessibility preference
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isPaused = false;

    // Cap DPR to prevent GPU throttling on high-res displays
    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;

    let width = 0;
    let height = 0;

    const setupDimensions = () => {
      if (!canvas) return;
      const parent = canvas.parentElement;
      width = parent?.clientWidth || window.innerWidth;
      height = parent?.clientHeight || window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    setupDimensions();

    const handleResize = () => {
      if (!canvas) return;
      setupDimensions();
    };

    // Pause animation when tab is inactive to preserve battery & CPU
    const handleVisibilityChange = () => {
      isPaused = document.hidden;
      if (!isPaused) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Luxury Palette Tokens: Champagne, Muted Rose Gold, Soft Blush
    const particleColors = [
      '#E7CFAF', // Champagne
      '#C58E91', // Muted Rose
      '#E2B8B2', // Soft Rose Gold
    ];

    // Responsive particle budgeting: 28 desktop, 12 mobile for hero
    const isMobile = width < 640;
    const defaultCount =
      variant === 'hero'
        ? (isMobile ? 12 : 28)
        : (isMobile ? 8 : 16);

    const particleCount = count !== undefined ? count : defaultCount;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.8,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -Math.random() * 0.35 - 0.08, // Gently drifting upward
        alpha: Math.random() * 0.45 + 0.2,
        alphaSpeed: (Math.random() - 0.5) * 0.005,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
      });
    }

    let lastTime = performance.now();

    const render = (time: number) => {
      if (isPaused) return;

      const delta = Math.min((time - lastTime) / 16.67, 2); // normalize 60fps delta
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx * delta;
        p.y += p.vy * delta;
        p.alpha += p.alphaSpeed * delta;

        if (p.alpha <= 0.12 || p.alpha >= 0.65) {
          p.alphaSpeed = -p.alphaSpeed;
        }

        // Boundary wrap
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = p.radius * 2.2;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, [count, variant]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none select-none ${className}`}
      aria-hidden="true"
    />
  );
};
