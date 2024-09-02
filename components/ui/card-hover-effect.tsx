'use client';

import { AnimatePresence, motion } from 'framer-motion';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export const HoverEffect: AceternityComponent<{ items: HoverEffectItem[] }> = ({ items, className }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={cn('grid grid-cols-1 py-10 md:grid-cols-2 lg:grid-cols-3', className)}>
      {items.map((item, idx) => (
        <Link
          key={item.link}
          href={item.link}
          className="group relative block h-full w-full p-2"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 block h-full w-full rounded-3xl bg-neutral-200 dark:bg-slate-800/[0.8]"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
              />
            )}
          </AnimatePresence>

          <div
            className={cn(
              'relative z-20 h-full w-full overflow-hidden rounded-2xl border border-transparent bg-black p-4 group-hover:border-slate-700 dark:border-white/[0.2]',
              className
            )}
          >
            <div className="relative z-50">
              <div className="p-4">
                <h4 className="mt-4 font-bold tracking-wide text-zinc-100">{item.title}</h4>
                <p className="mt-8 text-sm leading-relaxed tracking-wide text-zinc-400">{item.description}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export type HoverEffectItem = { id: string; title: string; description: string; link: string };
