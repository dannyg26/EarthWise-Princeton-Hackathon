'use client';

import { useEffect, useRef } from 'react';

export default function Starfield({
  className = '',
  baseCount = 220,
  intensity = 0.9,
  fps = 30,
  quality = 0.7,
}: {
  className?: string;
  baseCount?: number;
  intensity?: number;
  fps?: number;
  quality?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d', { alpha: true })!;

    // --- declare first (fixes the error) ---
    const center = { x: 0, y: 0 };
    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    let w = 0, h = 0;

    // Lower internal resolution but upscale via CSS for perf
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    const setSize = () => {
      const cssW = window.innerWidth;
      const cssH = window.innerHeight;
      const scale = Math.max(0.5, Math.min(1, quality)); // clamp 0.5–1
      canvas.width = Math.round(cssW * DPR * scale);
      canvas.height = Math.round(cssH * DPR * scale);
      canvas.style.width = cssW + 'px';
      canvas.style.height = cssH + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(DPR * scale, DPR * scale);
      w = cssW;
      h = cssH;
      center.x = w / 2;
      center.y = h / 2;
    };
    setSize();

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const STAR_LAYERS = reduced ? 2 : 3;
    const BASE_COUNT = reduced ? Math.max(60, baseCount * 0.35) : baseCount;

    type Star = { x: number; y: number; z: number; r: number; tw: number };
    const layers: { stars: Star[]; speed: number; color: string }[] = [];
    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    // Build layers (no expensive canvas blur)
    const colors = ['#dbeafe', '#bfdbfe', '#ffffff'];
    for (let i = 0; i < STAR_LAYERS; i++) {
      const count = Math.round((BASE_COUNT * (i + 1)) / (STAR_LAYERS * 1.35));
      const speed = (0.038 + i * 0.055) * intensity;
      const color = colors[i % colors.length];
      const stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: rand(0.5 + i * 0.2, 1 + i * 0.22),
        r: rand(0.35, i === 0 ? 0.9 : 0.75),
        tw: rand(0.18, 1.0),
      }));
      layers.push({ stars, speed, color });
    }

    // FPS cap
    const frameInterval = 1000 / fps;
    let last = 0;

    // Pause when tab hidden
    let paused = false;
    const onVis = () => { paused = document.visibilityState !== 'visible'; };
    document.addEventListener('visibilitychange', onVis);

    const onMouse = (e: MouseEvent) => { target.x = e.clientX; target.y = e.clientY; };
    const onTouch = (e: TouchEvent) => {
      if (e.touches?.[0]) { target.x = e.touches[0].clientX; target.y = e.touches[0].clientY; }
    };
    const onResize = () => setSize();

    const draw = (now: number) => {
      if (paused) { rafRef.current = requestAnimationFrame(draw); return; }
      if (now - last < frameInterval) { rafRef.current = requestAnimationFrame(draw); return; }
      last = now;

      // Smooth parallax
      mouse.x += (target.x - mouse.x) * 0.05;
      mouse.y += (target.y - mouse.y) * 0.05;

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < layers.length; i++) {
        const { stars, speed, color } = layers[i];
        ctx.fillStyle = color;

        for (let s = 0; s < stars.length; s++) {
          const star = stars[s];

          // Drift
          star.x += speed * star.z;
          if (star.x > w + 1) star.x = -1;
          if (star.x < -1) star.x = w + 1;

          // Light parallax
          const parallaxX = ((mouse.x - center.x) / Math.max(1, center.x)) * (0.35 / (star.z + i * 0.1));
          const parallaxY = ((mouse.y - center.y) / Math.max(1, center.y)) * (0.35 / (star.z + i * 0.1));

          const x = star.x + parallaxX * 16 * intensity;
          const y = star.y + parallaxY * 16 * intensity;

          const twinkle = 0.6 + 0.4 * Math.sin(now * 0.002 * star.tw + s);
          ctx.globalAlpha = twinkle;

          ctx.beginPath();
          ctx.arc(x, y, star.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('mousemove', onMouse, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('touchmove', onTouch);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [baseCount, intensity, fps, quality]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 -z-10 touch-none ${className}`}
      aria-hidden
    />
  );
}
