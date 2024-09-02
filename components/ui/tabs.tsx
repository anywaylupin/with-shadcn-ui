'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useState } from 'react';

export const Tabs: AceternityComponent<{
  items: Tab[];
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
}> = ({ items, containerClassName, activeTabClassName, tabClassName, contentClassName }) => {
  const [active, setActive] = useState<Tab>(items[0]);
  const [hovering, setHovering] = useState(false);
  const [tabs, setTabs] = useState<Tab[]>(items);

  const moveSelectedTabToTop = (idx: number) => {
    const newTabs = [...items];
    const selectedTab = newTabs.splice(idx, 1);
    newTabs.unshift(selectedTab[0]);
    setTabs(newTabs);
    setActive(newTabs[0]);
  };

  return (
    <>
      <div
        className={cn(
          'no-visible-scrollbar relative flex w-full max-w-full flex-row items-center justify-start overflow-auto [perspective:1000px] sm:overflow-visible',
          containerClassName
        )}
      >
        {items.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => moveSelectedTabToTop(idx)}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className={cn('relative rounded-full px-4 py-2', tabClassName)}
            style={{
              transformStyle: 'preserve-3d'
            }}
          >
            {active.value === item.value && (
              <motion.div
                layoutId="clickedbutton"
                transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
                className={cn('absolute inset-0 rounded-full bg-gray-200 dark:bg-zinc-800', activeTabClassName)}
              />
            )}

            <span className="relative block text-black dark:text-white">{item.title}</span>
          </button>
        ))}
      </div>

      <FadeInDiv
        items={tabs}
        active={active}
        key={active.value}
        hovering={hovering}
        className={cn('mt-32', contentClassName)}
      />
    </>
  );
};

export const FadeInDiv: AceternityComponent<{
  key?: string;
  items: Tab[];
  active: Tab;
  hovering?: boolean;
}> = ({ className, items, hovering }) => (
  <div className="relative h-full w-full">
    {items.map((item, idx) => (
      <motion.div
        key={item.value}
        layoutId={item.value}
        style={{
          scale: 1 - idx * 0.1,
          top: hovering ? idx * -50 : 0,
          zIndex: -idx,
          opacity: idx < 3 ? 1 - idx * 0.1 : 0
        }}
        animate={{ y: item.value === items[0].value ? [0, 40, 0] : 0 }}
        className={cn('absolute left-0 top-0 h-full w-full', className)}
      >
        {item.content}
      </motion.div>
    ))}
  </div>
);

type Tab = { id: React.Key; title: string; value: string; content?: StringNode };
