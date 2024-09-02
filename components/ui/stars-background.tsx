'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

export const StarsBackground: AceternityComponent<StarBackgroundProps> = ({
  starDensity = 0.00015,
  allStarsTwinkle = true,
  twinkleProbability = 0.7,
  twinkleSpeed,
  className
}) => {
  const [stars, setStars] = useState<StarProps[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const minTwinkleSpeed = twinkleSpeed?.min ?? 0.5;
  const maxTwinkleSpeed = twinkleSpeed?.max ?? 1;

  const generateStars = useCallback(
    (width: number, height: number): StarProps[] => {
      const numStars = Math.floor(width * height * starDensity);

      return Array.from({ length: numStars }, () => {
        const shouldTwinkle = allStarsTwinkle || Math.random() < twinkleProbability;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 0.05 + 0.5,
          opacity: Math.random() * 0.5 + 0.5,
          twinkleSpeed: shouldTwinkle ? minTwinkleSpeed + Math.random() * (maxTwinkleSpeed - minTwinkleSpeed) : null
        };
      });
    },
    [starDensity, allStarsTwinkle, twinkleProbability, minTwinkleSpeed, maxTwinkleSpeed]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateStars = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      setStars(generateStars(width, height));
    };

    updateStars();

    const resizeObserver = new ResizeObserver(updateStars);
    resizeObserver.observe(canvas);

    return () => resizeObserver.unobserve(canvas);
  }, [starDensity, allStarsTwinkle, twinkleProbability, minTwinkleSpeed, maxTwinkleSpeed, generateStars]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        if (star.twinkleSpeed !== null) {
          star.opacity = 0.5 + Math.abs(Math.sin((Date.now() * 0.001) / star.twinkleSpeed) * 0.5);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [stars]);

  return <canvas ref={canvasRef} className={cn('absolute inset-0 h-full w-full', className)} />;
};

type StarProps = {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number | null;
};

type StarBackgroundProps = {
  starDensity?: number;
  allStarsTwinkle?: boolean;
  twinkleProbability?: number;
  twinkleSpeed?: MinMaxValue;
};
