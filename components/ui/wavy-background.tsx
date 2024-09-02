'use client';

import { useEffect, useRef, useState } from 'react';

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

  let w: number, h: number, nt: number, i: number, x: number;
  let animationId: number;

  const getSpeed = () => {
    switch (speed) {
      default:
      case 'slow':
        return 0.001;
      case 'fast':
        return 0.002;
    }
  };

  const resize = (ctx: CanvasRenderingContext2D) => {
    w = ctx.canvas.width = window.innerWidth;
    h = ctx.canvas.height = window.innerHeight;
    ctx.filter = `blur(${blur}px)`;
  };

  const init = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    nt = 0;
    resize(ctx);
    window.onresize = () => resize(ctx);

    render();
  };

  const drawWave = (n: number) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    nt += getSpeed();
    for (i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.lineWidth = width;
      ctx.strokeStyle = colors[i % colors.length];

      for (x = 0; x < w; x += 5) {
        const y = noise(x / 800, 0.3 * i, nt) * 100;
        ctx.lineTo(x, y + h * 0.5);
      }

      ctx.stroke();
      ctx.closePath();
    }
  };

  const render = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = fill;
    ctx.globalAlpha = opacity;
    ctx.fillRect(0, 0, w, h);
    drawWave(5);
    animationId = requestAnimationFrame(render);
  };

  useEffect(() => {
    init();
    return () => cancelAnimationFrame(animationId);
  }, []);

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
