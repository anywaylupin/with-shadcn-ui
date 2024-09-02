'use client';

import { useCallback, useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';
import { createNoise3D } from 'simplex-noise';
import { useSafari } from '@/hooks';

export const WavyBackground: AceternityComponent<
  { colors?: string[]; width?: number; fill?: string; blur?: number; speed?: 'slow' | 'fast'; opacity?: number },
  HTMLDivElement
> = ({
  children,
  className,
  containerClassName,
  colors = ['#38bdf8', '#818cf8', '#c084fc', '#e879f9', '#22d3ee'],
  width = 50,
  fill = 'black',
  blur = 10,
  speed = 'fast',
  opacity = 0.5,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const noise = createNoise3D();

  const animationId = useRef<number | null>(null);
  const w = useRef<number>(0);
  const h = useRef<number>(0);
  const nt = useRef<number>(0);

  const getSpeed = useCallback(() => {
    switch (speed) {
      case 'slow':
        return 0.001;
      case 'fast':
        return 0.002;
      default:
        return 0.001;
    }
  }, [speed]);

  const drawWave = useCallback(
    (n: number) => {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx || typeof nt.current !== 'number') return;

      nt.current += getSpeed();

      for (let i = 0; i < n; i++) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = colors[i % colors.length];

        for (let x = 0; x < w.current; x += 5) {
          const y = noise(x / 800, 0.3 * i, nt.current) * 100;
          ctx.lineTo(x, y + h.current * 0.5);
        }

        ctx.stroke();
        ctx.closePath();
      }
    },
    [colors, getSpeed, noise, width]
  );

  const resize = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      w.current = ctx.canvas.width = window.innerWidth;
      h.current = ctx.canvas.height = window.innerHeight;
      ctx.filter = `blur(${blur}px)`;
    },
    [blur]
  );

  const render = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = fill;
    ctx.globalAlpha = opacity;
    ctx.fillRect(0, 0, w.current, h.current);
    drawWave(5);
    animationId.current = requestAnimationFrame(render);
  }, [drawWave, fill, h, opacity, w]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    nt.current = 0;
    resize(ctx);
    window.onresize = () => resize(ctx);

    render();

    return () => {
      if (animationId.current) cancelAnimationFrame(animationId.current);
    };
  }, [animationId, render, resize]);

  const [isSafari] = useSafari();

  return (
    <div className={cn('flex h-screen flex-col items-center justify-center', containerClassName)}>
      <canvas
        className="absolute inset-0 z-0"
        ref={canvasRef}
        style={{ filter: isSafari ? `blur(${blur}px)` : 'none' }}
      ></canvas>

      <div className={cn('relative z-10', className)} {...props}>
        {children}
      </div>
    </div>
  );
};
