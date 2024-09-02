'use client';

import { useCallback, useState } from 'react';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export const LayoutGrid: AceternityComponent<{ items: LayoutGridItem[] }> = ({ items }) => {
  const [selected, setSelected] = useState<LayoutGridItem | null>(null);
  const [lastSelected, setLastSelected] = useState<LayoutGridItem | null>(null);

  const handleClick = useCallback(
    (item: LayoutGridItem) => {
      setLastSelected(selected);
      setSelected(item);
    },
    [selected]
  );

  const handleOutsideClick = useCallback(() => {
    setLastSelected(selected);
    setSelected(null);
  }, [selected]);

  return (
    <div className="relative mx-auto grid h-full w-full max-w-7xl grid-cols-1 gap-4 p-10 md:grid-cols-3">
      {items.map((item, i) => (
        <div key={`${item.id}-${i}`} className={item.className}>
          <motion.div
            layoutId={`card-${item.id}`}
            onClick={() => handleClick(item)}
            className={cn(
              'relative overflow-hidden',
              selected?.id === item.id
                ? 'absolute inset-0 z-50 m-auto flex h-1/2 w-full cursor-pointer flex-col flex-wrap items-center justify-center rounded-lg md:w-1/2'
                : lastSelected?.id === item.id
                  ? 'z-40 h-full w-full rounded-xl bg-white'
                  : 'h-full w-full rounded-xl bg-white'
            )}
          >
            {selected?.id === item.id && <SelectedCard selected={selected} />}
            <motion.img
              layoutId={`image-${item.id}-image`}
              src={item.thumbnail}
              height="500"
              width="500"
              className="absolute inset-0 h-full w-full object-cover object-top transition duration-200"
              alt="thumbnail"
            />
          </motion.div>
        </div>
      ))}
      <motion.div
        onClick={handleOutsideClick}
        className={cn(
          'absolute left-0 top-0 z-10 h-full w-full bg-black opacity-0',
          selected?.id ? 'pointer-events-auto' : 'pointer-events-none'
        )}
        animate={{ opacity: selected?.id ? 0.3 : 0 }}
      />
    </div>
  );
};

const SelectedCard = ({ selected }: { selected: LayoutGridItem | null }) => (
  <div className="relative z-[60] flex h-full w-full flex-col justify-end rounded-lg bg-transparent shadow-2xl">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.6 }}
      className="absolute inset-0 z-10 h-full w-full bg-black opacity-60"
    />
    <motion.div
      layoutId={`content-${selected?.id}`}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative z-[70] px-8 pb-4"
    >
      {selected?.content}
    </motion.div>
  </div>
);

export type LayoutGridItem = { id: number; content: StringNode; className: string; thumbnail: string };
