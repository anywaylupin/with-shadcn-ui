'use client';

import { Point, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

export const MaskContainer: AceternityComponent<{
  revealText?: StringNode;
  size?: number;
  revealSize?: number;
}> = ({ children, revealText, size = 10, revealSize = 600, className }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState<Point>({ x: -100, y: -100 });
  const containerRef = useRef<HTMLDivElement>(null);

  const updateMousePosition = useCallback<(ev: HTMLElementEventMap['mousemove']) => void>((e) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    container?.addEventListener('mousemove', updateMousePosition);

    return () => container?.removeEventListener('mousemove', updateMousePosition);
  }, [updateMousePosition]);

  const maskSize = isHovered ? revealSize : size;

  return (
    <motion.div
      ref={containerRef}
      className={cn('relative h-screen', className)}
      animate={{ backgroundColor: isHovered ? 'var(--slate-900)' : 'var(--white)' }}
    >
      <motion.div
        className="absolute flex h-full w-full items-center justify-center bg-black text-6xl text-white bg-grid-white/[0.2] [mask-image:url(/mask.svg)] [mask-repeat:no-repeat] [mask-size:40px]"
        animate={{
          maskPosition: `${mousePosition.x - maskSize / 2}px ${mousePosition.y - maskSize / 2}px`,
          maskSize: `${maskSize}px`
        }}
        transition={{ duration: 0 }}
      >
        <div className="absolute inset-0 z-0 h-full w-full bg-black opacity-50" />
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative z-20 mx-auto max-w-4xl text-center text-4xl font-bold text-white"
        >
          {children}
        </div>
      </motion.div>

      <div className="flex h-full w-full items-center justify-center text-white">{revealText}</div>
    </motion.div>
  );
};
