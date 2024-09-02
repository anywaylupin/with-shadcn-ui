'use client';

import { AnimatePresence, Variants, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

export const ImagesSlider: AceternityComponent<{
  images: string[];
  overlay?: React.ReactNode;
  overlayClassName?: string;
  autoplay?: boolean;
  duration?: number;
  direction?: 'up' | 'down';
}> = ({
  images,
  children,
  overlay = true,
  overlayClassName,
  className,
  autoplay = true,
  duration = 1,
  direction = 'up'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);

  const handlePlay = useCallback(() => {
    setPlaying(true);
    setTimeout(() => setPlaying(false), duration * 1000);
  }, [duration]);

  const handleNext = useCallback(() => {
    if (playing) return;
    handlePlay();
    setCurrentIndex((prevIndex) => (prevIndex + 1 === images.length ? 0 : prevIndex + 1));
  }, [handlePlay, images.length, playing]);

  const handlePrevious = useCallback(() => {
    if (playing) return;
    handlePlay();
    setCurrentIndex((prevIndex) => (prevIndex - 1 < 0 ? images.length - 1 : prevIndex - 1));
  }, [handlePlay, images.length, playing]);

  useEffect(() => {
    const loadPromises = images.map(
      (image) =>
        new Promise<string>((resolve, reject) => {
          const img = new Image();
          img.src = image;
          img.onload = () => resolve(image);
          img.onerror = reject;
        })
    );

    Promise.all(loadPromises)
      .then((loadedImages) => setLoadedImages(loadedImages))
      .catch((error) => console.error('Failed to load images', error));
  }, [images]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        handleNext();
      } else if (event.key === 'ArrowLeft') {
        handlePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    let interval: NodeJS.Timeout | number = 0;
    if (autoplay) {
      interval = setInterval(() => {
        handleNext();
      }, 5000);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
  }, [autoplay, handleNext, handlePrevious]);

  const slideVariants: Variants = {
    initial: { scale: 0, opacity: 0, rotateX: 45 },
    visible: { scale: 1, rotateX: 0, opacity: 1, transition: { duration: 0.5, ease: [0.645, 0.045, 0.355, 1.0] } },
    upExit: { opacity: 1, y: '-150%', transition: { duration } },
    downExit: { opacity: 1, y: '150%', transition: { duration } }
  };

  const areImagesLoaded = loadedImages.length > 0;

  return (
    <div
      className={cn(
        'relative flex h-full w-full items-center justify-center overflow-hidden [perspective:1000px]',
        className
      )}
    >
      {areImagesLoaded && children}
      {areImagesLoaded && overlay && <div className={cn('absolute inset-0 z-40 bg-black/60', overlayClassName)} />}
      {areImagesLoaded && (
        <AnimatePresence>
          <motion.img
            key={currentIndex}
            src={loadedImages[currentIndex]}
            initial="initial"
            animate="visible"
            exit={direction === 'up' ? 'upExit' : 'downExit'}
            variants={slideVariants}
            className="image absolute inset-0 h-full w-full object-cover object-center"
          />
        </AnimatePresence>
      )}
    </div>
  );
};
