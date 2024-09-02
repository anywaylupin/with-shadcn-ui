'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';

import { IconDotsVertical } from '@tabler/icons-react';
import Image from 'next/image';
import { SparklesCore } from '@/components/ui/sparkles';
import { cn } from '@/lib/utils';

export const Compare: AceternityComponent<CompareProps> = ({
  first,
  second,
  className,
  initialSliderPercentage = 50,
  mode = 'hover',
  showHandlebar = true,
  autoplay = false,
  autoplayDuration = 5000
}) => {
  const [sliderXPercent, setSliderXPercent] = useState(initialSliderPercentage);
  const [isDragging, setIsDragging] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);

  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoplay = useCallback(() => {
    if (!autoplay) return;

    const startTime = Date.now();
    const animate = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = (elapsedTime % (autoplayDuration * 2)) / autoplayDuration;
      const percentage = progress <= 1 ? progress * 100 : (2 - progress) * 100;

      setSliderXPercent(percentage);
      autoplayRef.current = setTimeout(animate, 16); // ~60fps
    };

    animate();
  }, [autoplay, autoplayDuration]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearTimeout(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay]);

  const handleStart = useCallback(() => {
    if (mode === 'drag') setIsDragging(true);
  }, [mode]);

  const handleEnd = useCallback(() => {
    if (mode === 'drag') setIsDragging(false);
  }, [mode]);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return;
      if (mode === 'hover' || (mode === 'drag' && isDragging)) {
        const rect = sliderRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percent = (x / rect.width) * 100;
        requestAnimationFrame(() => setSliderXPercent(Math.max(0, Math.min(100, percent))));
      }
    },
    [mode, isDragging]
  );

  const handleMouseLeave = useCallback(() => {
    if (mode === 'hover') setSliderXPercent(initialSliderPercentage);
    else if (mode === 'drag') setIsDragging(false);

    startAutoplay();
  }, [initialSliderPercentage, mode, startAutoplay]);

  const handleTouchStart = useCallback(() => {
    if (!autoplay) handleStart();
  }, [handleStart, autoplay]);

  const handleTouchEnd = useCallback(() => {
    if (!autoplay) handleEnd();
  }, [handleEnd, autoplay]);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!autoplay) handleMove(e.touches[0].clientX);
    },
    [handleMove, autoplay]
  );

  return (
    <div
      ref={sliderRef}
      className={cn('h-[400px] w-[400px] overflow-hidden', className)}
      style={{ position: 'relative', cursor: mode === 'drag' ? 'grab' : 'col-resize' }}
      onMouseDown={() => handleStart()}
      onMouseUp={() => handleEnd()}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseEnter={() => stopAutoplay()}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      <AnimatePresence initial={false}>
        <motion.div
          className="absolute top-0 z-30 m-auto h-full w-px bg-gradient-to-b from-transparent from-[5%] via-indigo-500 to-transparent to-[95%]"
          style={{ left: `${sliderXPercent}%`, top: '0', zIndex: 40 }}
          transition={{ duration: 0 }}
        >
          <div className="absolute left-0 top-1/2 z-20 h-full w-36 -translate-y-1/2 bg-gradient-to-r from-indigo-400 via-transparent to-transparent opacity-50 [mask-image:radial-gradient(100px_at_left,white,transparent)]" />
          <div className="absolute left-0 top-1/2 z-10 h-1/2 w-10 -translate-y-1/2 bg-gradient-to-r from-cyan-400 via-transparent to-transparent opacity-100 [mask-image:radial-gradient(50px_at_left,white,transparent)]" />
          <div className="absolute -right-10 top-1/2 h-3/4 w-10 -translate-y-1/2 [mask-image:radial-gradient(100px_at_left,white,transparent)]">
            <MemoizedSparklesCore
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={1200}
              className="h-full w-full"
              particleColor="#FFFFFF"
            />
          </div>
          {showHandlebar && (
            <div className="absolute -right-2.5 top-1/2 z-30 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-md bg-white shadow-[0px_-1px_0px_0px_#FFFFFF40]">
              <IconDotsVertical className="h-4 w-4 text-black" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="pointer-events-none relative z-20 h-full w-full overflow-hidden">
        <AnimatePresence initial={false}>
          {first?.image && (
            <motion.div
              className={cn(
                'absolute inset-0 z-20 h-full w-full flex-shrink-0 select-none overflow-hidden rounded-2xl',
                first?.className
              )}
              style={{ clipPath: `inset(0 ${100 - sliderXPercent}% 0 0)` }}
              transition={{ duration: 0 }}
            >
              <Image
                className={cn(
                  'absolute inset-0 z-20 h-full w-full flex-shrink-0 select-none rounded-2xl',
                  first?.className
                )}
                src={first.image}
                alt="first image"
                draggable={false}
                priority
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false}>
        {second?.image && (
          <motion.img
            className={cn('absolute left-0 top-0 z-[19] h-full w-full select-none rounded-2xl', second.className)}
            alt="second image"
            src={second.image}
            draggable={false}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const MemoizedSparklesCore = memo(SparklesCore);

type CompareImageProps = { image?: string; className?: string };

type CompareProps = {
  first?: CompareImageProps;
  second?: CompareImageProps;
  initialSliderPercentage?: number;
  mode?: 'hover' | 'drag';
  showHandlebar?: boolean;
  autoplay?: boolean;
  autoplayDuration?: number;
};
