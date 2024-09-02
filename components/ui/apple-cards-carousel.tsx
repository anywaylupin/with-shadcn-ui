'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { IconArrowNarrowLeft, IconArrowNarrowRight, IconX } from '@tabler/icons-react';
import Image, { ImageProps } from 'next/image';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { useOutsideClick } from '@/hooks';

export const CarouselContext = createContext<{ currentIndex: number; onCardClose: (index: number) => void }>({
  currentIndex: 0,
  onCardClose: () => {}
});

export const Carousel: AceternityComponent<CarouselProps> = ({ items, initialScroll = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollLeft = useCallback(() => ref.current?.scrollBy({ left: -300, behavior: 'smooth' }), []);
  const scrollRight = useCallback(() => ref.current?.scrollBy({ left: 300, behavior: 'smooth' }), []);

  const checkScrollability = useCallback(() => {
    if (!ref.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = ref.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
  }, []);

  const handleCardClose = useCallback((index: number) => {
    if (!ref.current) return;

    const isMobile = window && window.innerWidth < 768;
    const cardWidth = isMobile ? 230 : 384; // (md:w-96)
    const gap = isMobile ? 4 : 8;
    const scrollPosition = (cardWidth + gap) * (index + 1);
    ref.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    setCurrentIndex(index);
  }, []);

  const providerValue = useMemo(
    () => ({ onCardClose: handleCardClose, currentIndex }),
    [currentIndex, handleCardClose]
  );

  useEffect(() => {
    if (!ref.current) return;

    ref.current.scrollLeft = initialScroll;
    checkScrollability();
  }, [checkScrollability, initialScroll]);

  return (
    <CarouselContext.Provider value={providerValue}>
      <div className="relative w-full">
        <div
          className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-10 scrollbar-none md:py-20"
          ref={ref}
          onScroll={checkScrollability}
        >
          <div className={cn('absolute right-0 z-[1000] h-auto w-[5%] overflow-hidden bg-gradient-to-l')}></div>

          <div
            className={cn(
              'flex flex-row justify-start gap-4 pl-4',
              'mx-auto max-w-7xl' // remove max-w-4xl if you want the carousel to span the full width of its container
            )}
          >
            {items.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, delay: 0.2 * index, ease: 'easeOut', once: true }
                }}
                key={`${item.key ?? 'card'}-${index}`}
                className="rounded-3xl last:pr-[5%] md:last:pr-[33%]"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mr-10 flex justify-end gap-2">
          <button
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          >
            <IconArrowNarrowLeft className="h-6 w-6 text-gray-500" />
          </button>
          <button
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50"
            onClick={scrollRight}
            disabled={!canScrollRight}
          >
            <IconArrowNarrowRight className="h-6 w-6 text-gray-500" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({ card, index, layout = false }: { card: CardType; index: number; layout?: boolean }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose } = useContext(CarouselContext);

  const handleClose = useCallback(() => {
    setOpen(false);
    onCardClose(index);
  }, [index, onCardClose]);

  useOutsideClick(containerRef, () => handleClose());

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };

    document.body.style.overflow = open ? 'hidden' : 'auto';

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleClose, open]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 h-screen overflow-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 h-full w-full bg-black/80 backdrop-blur-lg"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              className="relative z-[60] mx-auto my-10 h-fit max-w-5xl rounded-3xl bg-white p-4 font-sans md:p-10 dark:bg-neutral-900"
            >
              <button
                className="sticky right-0 top-4 ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-black dark:bg-white"
                onClick={handleClose}
              >
                <IconX className="h-6 w-6 text-neutral-100 dark:text-neutral-900" />
              </button>
              <motion.p
                layoutId={layout ? `category-${card.title}` : undefined}
                className="text-base font-medium text-black dark:text-white"
              >
                {card.category}
              </motion.p>
              <motion.p
                layoutId={layout ? `title-${card.title}` : undefined}
                className="mt-4 text-2xl font-semibold text-neutral-700 md:text-5xl dark:text-white"
              >
                {card.title}
              </motion.p>
              <div className="py-10">{card.content}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.button
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={() => setOpen(true)}
        className="relative z-10 flex h-80 w-56 flex-col items-start justify-start overflow-hidden rounded-3xl bg-gray-100 md:h-[40rem] md:w-96 dark:bg-neutral-900"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-gradient-to-b from-black/50 via-transparent to-transparent" />
        <div className="relative z-40 p-8">
          <motion.p
            layoutId={layout ? `category-${card.category}` : undefined}
            className="text-left font-sans text-sm font-medium text-white md:text-base"
          >
            {card.category}
          </motion.p>
          <motion.p
            layoutId={layout ? `title-${card.title}` : undefined}
            className="mt-2 max-w-xs text-balance text-left font-sans text-xl font-semibold text-white md:text-3xl"
          >
            {card.title}
          </motion.p>
        </div>
        <BlurImage
          src={card.src}
          alt={card.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="absolute inset-0 z-10 object-cover"
        />
      </motion.button>
    </>
  );
};

export const BlurImage = ({ src, className, alt, ...rest }: ImageProps) => {
  const [loading, setLoading] = useState(true);

  return (
    <Image
      className={cn('transition duration-300', loading ? 'blur-sm' : 'blur-0', className)}
      onLoad={() => setLoading(false)}
      src={src}
      decoding="async"
      blurDataURL={typeof src === 'string' ? src : undefined}
      alt={alt}
      priority
      {...rest}
    />
  );
};

export type CardType = { src: string; title: string; category: string; content: React.ReactNode };

export type CarouselProps = { items: JSX.Element[]; initialScroll?: number };
