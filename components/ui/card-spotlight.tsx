'use client';

import { MouseEvent as ReactMouseEvent, useCallback, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

import { CanvasRevealEffect } from '@/components/ui/canvas-reveal-effect';
import { cn } from '@/lib/utils';

export const CardSpotlight: AceternityComponent<{ radius?: number; color?: string }, HTMLDivElement> = ({
  children,
  radius = 350,
  color = '#262626',
  className,
  ...props
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback(
    ({ currentTarget, clientX, clientY }: ReactMouseEvent<HTMLDivElement>) => {
      const { left, top } = currentTarget.getBoundingClientRect();

      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    },
    [mouseX, mouseY]
  );

  const [hovered, setHovered] = useState(false);
  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  const maskImage = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px,white,transparent 80%)`;

  return (
    <div
      className={cn(
        'group/spotlight relative rounded-md border border-neutral-800 bg-black p-10 dark:border-neutral-800',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px z-0 rounded-md opacity-0 transition duration-300 group-hover/spotlight:opacity-100"
        style={{ backgroundColor: color, maskImage, WebkitMaskImage: maskImage }}
      >
        {hovered && (
          <CanvasRevealEffect
            animationSpeed={5}
            containerClassName="bg-transparent absolute inset-0 pointer-events-none"
            colors={[
              [59, 130, 246],
              [139, 92, 246]
            ]}
            dotSize={3}
          />
        )}
      </motion.div>
      {children}
    </div>
  );
};
