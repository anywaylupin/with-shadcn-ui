'use client';

import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import { cn, getRandomElement } from '@/lib/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

export const FollowerPointerCard: AceternityComponent<{ title: StringNode; colors?: string[] }> = ({
  children,
  className,
  title,
  colors = [
    'var(--sky-500)',
    'var(--neutral-500)',
    'var(--teal-500)',
    'var(--green-500)',
    'var(--blue-500)',
    'var(--red-500)',
    'var(--yellow-500)'
  ]
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const ref = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [isInside, setIsInside] = useState<boolean>(false);
  useEffect(() => {
    if (!ref.current) return;
    setRect(ref.current.getBoundingClientRect());
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!rect) return;
      x.set(e.clientX - rect.left + window.scrollX);
      y.set(e.clientY - rect.top + window.scrollY);
    },
    [rect, x, y]
  );

  return (
    <div
      ref={ref}
      aria-hidden
      onMouseLeave={() => setIsInside(false)}
      onMouseEnter={() => setIsInside(true)}
      onMouseMove={handleMouseMove}
      style={{ cursor: 'none' }}
      className={cn('relative', className)}
    >
      <AnimatePresence>
        {isInside && (
          <motion.div
            style={{ top: y, left: x, pointerEvents: 'none' }}
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute z-50 h-4 w-4 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="1"
              viewBox="0 0 16 16"
              className="h-6 w-6 -translate-x-[12px] -translate-y-[10px] -rotate-[70deg] transform stroke-sky-600 text-sky-500"
              height="1em"
              width="1em"
            >
              <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z"></path>
            </svg>

            <motion.div
              style={{ backgroundColor: getRandomElement(colors) }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className={'min-w-max whitespace-nowrap rounded-full bg-neutral-200 px-2 py-2 text-xs text-white'}
            >
              {title}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
};
