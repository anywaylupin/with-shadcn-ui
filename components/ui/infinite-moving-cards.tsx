'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

export const InfiniteMovingCards: AceternityComponent<InfiniteMovingCardsProps> = ({
  items,
  direction = 'forwards',
  speed = 'fast',
  pauseOnHover = true,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);

  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !scrollerRef.current) return;
    const scrollerContent = Array.from(scrollerRef.current.children);
    scrollerContent.forEach((item) => scrollerRef.current?.appendChild(item.cloneNode(true)));

    containerRef.current.style.setProperty('--animation-direction', direction);

    switch (speed) {
      case 'fast':
        containerRef.current.style.setProperty('--animation-duration', '20s');
        break;
      case 'normal':
        containerRef.current.style.setProperty('--animation-duration', '40s');
        break;
      case 'slow':
        containerRef.current.style.setProperty('--animation-duration', '80s');
        break;
      default:
        containerRef.current.style.setProperty('--animation-duration', `${speed}s`);
        break;
    }

    setStart(true);
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]',
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn('flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4', {
          'animate-scroll': start,
          'hover:[animation-play-state:paused]': pauseOnHover
        })}
      >
        {items.map((item) => (
          <li
            key={item.id}
            className="relative w-[350px] max-w-full flex-shrink-0 rounded-2xl border border-b-0 border-slate-700 px-8 py-6 md:w-[450px]"
            style={{ background: 'linear-gradient(180deg,var(--slate-800),var(--slate-900)' }}
          >
            <blockquote>
              <div
                aria-hidden
                className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
              ></div>
              <span className="relative z-20 text-sm font-normal leading-[1.6] text-gray-100">{item.quote}</span>
              <div className="relative z-20 mt-6 flex flex-row items-center">
                <span className="flex flex-col gap-1">
                  <span className="text-sm font-normal leading-[1.6] text-gray-400">{item.name}</span>
                  <span className="text-sm font-normal leading-[1.6] text-gray-400">{item.title}</span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};

type InfiniteMovingCardsItem = { id: React.Key; quote: string; name: string; title: string };

type InfiniteMovingCardsProps = {
  items: InfiniteMovingCardsItem[];
  direction?: 'forwards' | 'reverse';
  speed?: 'fast' | 'normal' | 'slow' | number;
  pauseOnHover?: boolean;
};
