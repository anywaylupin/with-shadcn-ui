'use client';

import { motion, useAnimationFrame, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion';

import { cn } from '@/lib/utils';
import { useRef } from 'react';

export const Button: AceternityComponent<{
  borderRadius?: string;
  as?: React.ElementType;
  borderClassName?: string;
  duration?: number;
  [key: string]: unknown;
}> = ({
  borderRadius = '1.75rem',
  children,
  as: Component = 'button',
  containerClassName,
  borderClassName,
  duration,
  className,
  ...rest
}) => (
  <Component
    className={cn('relative h-16 w-40 overflow-hidden bg-transparent p-[1px] text-xl', containerClassName)}
    style={{ borderRadius }}
    {...rest}
  >
    <div className="absolute inset-0" style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}>
      <MovingBorder duration={duration} rx="30%" ry="30%">
        <div
          className={cn(
            'h-20 w-20 bg-[radial-gradient(var(--sky-500)_40%,transparent_60%)] opacity-[0.8]',
            borderClassName
          )}
        />
      </MovingBorder>
    </div>

    <div
      className={cn(
        'relative flex h-full w-full items-center justify-center border border-slate-800 bg-slate-900/[0.8] text-sm text-white antialiased backdrop-blur-xl',
        className
      )}
      style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
    >
      {children}
    </div>
  </Component>
);

export const MovingBorder: AceternityComponent<{ duration?: number; rx?: string; ry?: string }, SVGSVGElement> = ({
  children,
  duration = 2000,
  rx,
  ry,
  ...rest
}) => {
  const pathRef = useRef<SVGRectElement>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).x);
  const y = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).y);

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...rest}
      >
        <rect fill="none" width="100%" height="100%" rx={rx} ry={ry} ref={pathRef} />
      </svg>
      <motion.div style={{ transform }} className="absolute left-0 top-0 inline-block">
        {children}
      </motion.div>
    </>
  );
};
