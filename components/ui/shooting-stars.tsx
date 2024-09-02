'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

export const ShootingStars: AceternityComponent<ShootingStarsProps> = ({
  width = 10,
  height = 1,
  speed,
  delay,
  color = '#9E00FF',
  trail = '#2EB9DF',
  className
}) => {
  const [star, setStar] = useState<ShootingStar | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const minSpeed = speed?.min ?? 10;
  const maxSpeed = speed?.min ?? 30;
  const minDelay = delay?.min ?? 1200;
  const maxDelay = delay?.min ?? 2400;

  const getRandomStartPoint = useCallback(() => {
    const side = Math.floor(Math.random() * 4);
    const offset = Math.random() * window.innerWidth;

    switch (side) {
      case 0:
        return { x: offset, y: 0, angle: 45 };
      case 1:
        return { x: window.innerWidth, y: offset, angle: 135 };
      case 2:
        return { x: offset, y: window.innerHeight, angle: 225 };
      case 3:
        return { x: 0, y: offset, angle: 315 };
      default:
        return { x: 0, y: 0, angle: 45 };
    }
  }, []);

  useEffect(() => {
    const createStar = () => {
      const { x, y, angle } = getRandomStartPoint();
      const newStar: ShootingStar = {
        id: Date.now(),
        x,
        y,
        angle,
        scale: 1,
        speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
        distance: 0
      };
      setStar(newStar);

      const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;
      setTimeout(createStar, randomDelay);
    };

    createStar();

    return () => {};
  }, [getRandomStartPoint, maxDelay, maxSpeed, minDelay, minSpeed]);

  useEffect(() => {
    const moveStar = () => {
      if (!star) return;

      setStar((prevStar) => {
        if (!prevStar) return null;
        const newX = prevStar.x + prevStar.speed * Math.cos((prevStar.angle * Math.PI) / 180);
        const newY = prevStar.y + prevStar.speed * Math.sin((prevStar.angle * Math.PI) / 180);
        const newDistance = prevStar.distance + prevStar.speed;
        const newScale = 1 + newDistance / 100;

        return newX < -20 || newX > window.innerWidth + 20 || newY < -20 || newY > window.innerHeight + 20
          ? null
          : { ...prevStar, x: newX, y: newY, distance: newDistance, scale: newScale };
      });
    };

    const animationFrame = requestAnimationFrame(moveStar);
    return () => cancelAnimationFrame(animationFrame);
  }, [star]);

  return (
    <svg ref={svgRef} className={cn('absolute inset-0 h-full w-full', className)}>
      {star && (
        <rect
          key={star.id}
          x={star.x}
          y={star.y}
          width={width * star.scale}
          height={height}
          fill="url(#gradient)"
          transform={`rotate(${star.angle}, ${star.x + (width * star.scale) / 2}, ${star.y + height / 2})`}
        />
      )}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: trail, stopOpacity: 0 }} />
          <stop offset="100%" style={{ stopColor: color, stopOpacity: 1 }} />
        </linearGradient>
      </defs>
    </svg>
  );
};

type ShootingStar = {
  id: React.Key;
  x: number;
  y: number;
  angle: number;
  scale: number;
  speed: number;
  distance: number;
};

type ShootingStarsProps = {
  width?: number;
  height?: number;
  delay?: MinMaxValue;
  speed?: MinMaxValue;
  color?: string;
  trail?: string;
};
