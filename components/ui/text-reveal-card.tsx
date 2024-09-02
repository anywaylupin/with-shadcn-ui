'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export const TextRevealCard: AceternityComponent<{
  text: string;
  revealText: string;
  amount?: number;
}> = ({ text, revealText, amount, children, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [left, setLeft] = useState(0);
  const [localWidth, setLocalWidth] = useState(0);
  const [widthPercentage, setWidthPercentage] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const { left, width } = ref.current.getBoundingClientRect();
    setLeft(left);
    setLocalWidth(width);
  }, []);

  const handleMouseMove = useCallback<React.MouseEventHandler<HTMLDivElement>>(
    (e) => {
      e.preventDefault();
      if (!ref.current) return;

      const { clientX } = e;
      const relativeX = clientX - left;
      setWidthPercentage((relativeX / localWidth) * 100);
    },
    [left, localWidth]
  );

  const handleMouseLeave = useCallback(() => {
    setIsMouseOver(false);
    setWidthPercentage(0);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsMouseOver(true);
  }, []);

  const handleTouchMove = useCallback<React.TouchEventHandler<HTMLDivElement>>(
    (e) => {
      e.preventDefault();
      if (!ref.current) return;

      const clientX = e.touches[0].clientX;
      const relativeX = clientX - left;
      setWidthPercentage((relativeX / localWidth) * 100);
    },
    [left, localWidth]
  );

  const rotateDeg = (widthPercentage - 50) * 0.1;

  return (
    <div
      aria-hidden
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onTouchStart={handleMouseEnter}
      onTouchEnd={handleMouseLeave}
      onTouchMove={handleTouchMove}
      className={cn(
        'relative w-[40rem] overflow-hidden rounded-lg border border-white/[0.08] bg-[#1d1c20] p-8',
        className
      )}
    >
      {children}

      <div className="relative flex h-40 items-center overflow-hidden">
        <motion.div
          animate={
            isMouseOver
              ? { opacity: widthPercentage > 0 ? 1 : 0, clipPath: `inset(0 ${100 - widthPercentage}% 0 0)` }
              : { clipPath: `inset(0 ${100 - widthPercentage}% 0 0)` }
          }
          transition={{ duration: isMouseOver ? 0 : 0.4 }}
          className="absolute z-20 w-full bg-[#1d1c20] will-change-transform"
        >
          <p
            style={{ textShadow: '4px 4px 15px rgba(0,0,0,0.5)' }}
            className="bg-gradient-to-b from-white to-neutral-300 bg-clip-text py-10 text-base font-bold text-transparent text-white sm:text-[3rem]"
          >
            {revealText}
          </p>
        </motion.div>

        <motion.div
          animate={{ left: `${widthPercentage}%`, rotate: `${rotateDeg}deg`, opacity: widthPercentage > 0 ? 1 : 0 }}
          transition={{ duration: isMouseOver ? 0 : 0.4 }}
          className="absolute z-50 h-40 w-[8px] bg-gradient-to-b from-transparent via-neutral-800 to-transparent will-change-transform"
        ></motion.div>

        <div className="overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,white,transparent)]">
          <p className="bg-[#323238] bg-clip-text py-10 text-base font-bold text-transparent sm:text-[3rem]">{text}</p>
          <MemoizedStars amount={amount} />
        </div>
      </div>
    </div>
  );
};

export const TextRevealCardTitle: AceternityComponent = ({ children, className }) => (
  <h2 className={cn('mb-2 text-lg text-white', className)}>{children}</h2>
);

export const TextRevealCardDescription: AceternityComponent = ({ children, className }) => (
  <p className={cn('text-sm text-[#a9a9a9]', className)}>{children}</p>
);

const Stars: AceternityComponent<{ amount?: number }> = ({ amount = 80 }) => {
  const random = () => Math.random();
  const randomMove = () => random() * 4 - 2;
  const randomOpacity = () => random();

  return (
    <div className="absolute inset-0">
      {Array.from({ length: amount }).map((_, i) => (
        <motion.span
          key={`star-${amount - i}`}
          animate={{
            top: `calc(${random() * 100}% + ${randomMove()}px)`,
            left: `calc(${random() * 100}% + ${randomMove()}px)`,
            opacity: randomOpacity(),
            scale: [1, 1.2, 0]
          }}
          transition={{ duration: random() * 10 + 20, repeat: Infinity, ease: 'linear' }}
          className="absolute z-[1] inline-block size-0.5 rounded-[50%] bg-white"
        ></motion.span>
      ))}
    </div>
  );
};

export const MemoizedStars = memo(Stars);
