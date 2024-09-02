'use client';

import { AnimatePresence, Point, motion, useMotionTemplate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

export const Lens: AceternityComponent<Partial<LensProps>> = ({
  children,
  zoomFactor = 1.5,
  lensSize = 170,
  isStatic = false,
  position = { x: 200, y: 150 },
  onHovered
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState(position);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  useEffect(() => onHovered?.(hovered), [hovered, onHovered]);

  return (
    <div
      ref={ref}
      className="relative z-20 overflow-hidden rounded-lg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {children}

      {isStatic ? (
        <Lenses zoomFactor={zoomFactor} lensSize={lensSize} position={position}>
          {children}
        </Lenses>
      ) : (
        <AnimatePresence>
          {hovered && (
            <Lenses zoomFactor={zoomFactor} lensSize={lensSize} position={mousePosition}>
              {children}
            </Lenses>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

const Lenses: AceternityComponent<LensProps> = ({ children, zoomFactor, lensSize, position, isStatic }) => {
  const maskImage = useMotionTemplate`radial-gradient(circle ${lensSize / 2}px at ${position.x}px ${position.y}px, black 100%, transparent 100%)`;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, scale: 0.58 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={cn('absolute inset-0 overflow-hidden', { 'z-50': isStatic })}
        style={{ maskImage, WebkitMaskImage: maskImage, transformOrigin: `${position.x}px ${position.y}px` }}
      >
        <div
          className="absolute inset-0"
          style={{ transform: `scale(${zoomFactor})`, transformOrigin: `${position.x}px ${position.y}px` }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
};

type LensProps = {
  zoomFactor?: number;
  lensSize: number;
  position: Point;
  isStatic?: boolean;
  onHovered?: (hovered: boolean) => void;
};
