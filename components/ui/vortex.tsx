'use client';

import { cn, fadeInOut, lerp, rand, randRange } from '@/lib/utils';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { TAU } from '@/constants';
import { createNoise3D } from 'simplex-noise';
import { motion } from 'framer-motion';

export const Vortex: AceternityComponent<VortexProps> = ({
  children,
  className,
  containerClassName,
  amount = 700,
  rangeY = 100,
  baseSpeed = 0.0,
  rangeSpeed = 1.5,
  baseRadius = 1,
  rangeRadius = 2,
  baseHue = 220,
  rangeHue = 100,
  baseTTL = 50,
  rangeTTL = 150,
  bgColor = '#000000',
  xOff = 0.00125,
  yOff = 0.00125,
  zOff = 0.0005,
  noiseSteps = 3
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particleCount = 9;
  const particleAmount = amount * particleCount;

  const noise3D = createNoise3D();
  const tick = useRef(0);
  const center = useMemo<[number, number]>(() => [0, 0], []);
  const particleProps = useMemo(() => new Float32Array(particleAmount), [particleAmount]);

  const initParticle = useCallback(
    (i: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const x = rand(canvas.width);
      const y = center[1] + randRange(rangeY);
      const vx = 0;
      const vy = 0;
      const life = 0;
      const ttl = baseTTL + rand(rangeTTL);
      const speed = baseSpeed + rand(rangeSpeed);
      const radius = baseRadius + rand(rangeRadius);
      const hue = baseHue + rand(rangeHue);

      particleProps.set([x, y, vx, vy, life, ttl, speed, radius, hue], i);
    },
    [
      baseHue,
      baseRadius,
      baseSpeed,
      baseTTL,
      center,
      particleProps,
      rangeHue,
      rangeRadius,
      rangeSpeed,
      rangeTTL,
      rangeY
    ]
  );

  const updateParticle = useCallback(
    (i: number, ctx: CanvasRenderingContext2D) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const i2 = 1 + i;
      const i3 = 2 + i;
      const i4 = 3 + i;
      const i5 = 4 + i;
      const i6 = 5 + i;
      const i7 = 6 + i;
      const i8 = 7 + i;
      const i9 = 8 + i;

      const x = particleProps[i];
      const y = particleProps[i2];
      const n = noise3D(x * xOff, y * yOff, tick.current * zOff) * noiseSteps * TAU;
      const vx = lerp(particleProps[i3], Math.cos(n), 0.5);
      const vy = lerp(particleProps[i4], Math.sin(n), 0.5);
      let life = particleProps[i5];
      const ttl = particleProps[i6];
      const speed = particleProps[i7];
      const x2 = x + vx * speed;
      const y2 = y + vy * speed;
      const radius = particleProps[i8];
      const hue = particleProps[i9];

      // Draw Particle
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineWidth = radius;
      ctx.strokeStyle = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.closePath();
      ctx.restore();

      life++;

      particleProps[i] = x2;
      particleProps[i2] = y2;
      particleProps[i3] = vx;
      particleProps[i4] = vy;
      particleProps[i5] = life;

      const checkBounds = (x: number, y: number, canvas: HTMLCanvasElement) =>
        x > canvas.width || x < 0 || y > canvas.height || y < 0;

      if (checkBounds(x, y, canvas) || life > ttl) {
        initParticle(i);
      }
    },
    [initParticle, noise3D, noiseSteps, particleProps, tick, xOff, yOff, zOff]
  );

  const drawParticles = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      for (let i = 0; i < particleAmount; i += particleCount) updateParticle(i, ctx);
    },
    [particleAmount, updateParticle]
  );

  const draw = useCallback(
    (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
      tick.current++;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawParticles(ctx);

      ctx.save();
      ctx.filter = 'blur(8px) brightness(200%)';
      ctx.globalCompositeOperation = 'lighter';
      ctx.drawImage(canvas, 0, 0);
      ctx.restore();

      ctx.save();
      ctx.filter = 'blur(4px) brightness(200%)';
      ctx.globalCompositeOperation = 'lighter';
      ctx.drawImage(canvas, 0, 0);
      ctx.restore();

      window.requestAnimationFrame(() => draw(canvas, ctx));
    },
    [bgColor, drawParticles, tick]
  );
  const resize = useCallback(
    (canvas: HTMLCanvasElement) => {
      const { innerWidth, innerHeight } = window;

      canvas.width = innerWidth;
      canvas.height = innerHeight;

      center[0] = 0.5 * canvas.width;
      center[1] = 0.5 * canvas.height;
    },
    [center]
  );

  const setup = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (canvas && container) {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      resize(canvas);

      tick.current = 0;
      particleProps.set(new Float32Array(particleAmount));

      for (let i = 0; i < particleAmount; i += particleCount) initParticle(i);

      draw(canvas, ctx);
    }
  }, [draw, initParticle, particleAmount, particleProps, resize]);

  useEffect(() => {
    setup();
    window.addEventListener('resize', () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) resize(canvas);
    });
  }, [setup, resize]);

  return (
    <div className={cn('relative h-full w-full', containerClassName)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        ref={containerRef}
        className="absolute inset-0 z-0 flex h-full w-full items-center justify-center bg-transparent"
      >
        <canvas ref={canvasRef}></canvas>
      </motion.div>

      <div className={cn('relative z-10', className)}>{children}</div>
    </div>
  );
};

type VortexProps = {
  amount?: number;
  bgColor?: string;
  rangeY?: number;
  baseHue?: number;
  rangeHue?: number;
  baseTTL?: number;
  rangeTTL?: number;
  baseSpeed?: number;
  rangeSpeed?: number;
  baseRadius?: number;
  rangeRadius?: number;
} & VortexNoises;

type VortexNoises = {
  xOff?: number;
  yOff?: number;
  zOff?: number;
  noiseSteps?: number;
};
