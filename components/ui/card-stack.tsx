'use client';

import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';

type CardStackItem = { id: number; name: string; designation: string; content: React.ReactNode };

export type CardStackProps = { items: CardStackItem[]; offset?: number; scaleFactor?: number };

export const CardStack = ({ items, offset = 10, scaleFactor = 0.06 }: CardStackProps) => {
  const [cards, setCards] = useState<CardStackItem[]>(items);

  useEffect(() => {
    const interval = setInterval(() => {
      setCards((prevCards: CardStackItem[]) => {
        const newArray = [...prevCards];
        newArray.unshift(newArray.pop()!);
        return newArray;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-60 w-60 md:h-60 md:w-96">
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            className="absolute flex h-60 w-60 flex-col justify-between rounded-3xl border border-neutral-200 bg-white p-4 shadow-xl shadow-black/[0.1] dark:border-white/[0.1] dark:bg-black dark:shadow-white/[0.05] md:h-60 md:w-96"
            style={{ transformOrigin: 'top center' }}
            animate={{ top: index * -offset, scale: 1 - index * scaleFactor, zIndex: cards.length - index }}
          >
            <div className="font-normal text-neutral-700 dark:text-neutral-200">{card.content}</div>
            <div>
              <p className="font-medium text-neutral-500 dark:text-white">{card.name}</p>
              <p className="font-normal text-neutral-400 dark:text-neutral-200">{card.designation}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
