'use client';

import { memo, useState } from 'react';

import Image from 'next/image';
import { cn } from '@/lib/utils';

export const FocusCard = memo<FocusCardProps>(function FocusCard({ card, index, hovered, setHovered }) {
  return (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        'relative h-60 w-full overflow-hidden rounded-lg bg-gray-100 transition-all duration-300 ease-out md:h-96 dark:bg-neutral-900',
        hovered !== null && hovered !== index && 'scale-[0.98] blur-sm'
      )}
    >
      <Image
        src={card.src}
        alt={card.title}
        className="absolute inset-0 object-cover"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div
        className={cn(
          'absolute inset-0 flex items-end bg-black/50 px-4 py-8 transition-opacity duration-300',
          hovered === index ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className="bg-gradient-to-b from-neutral-50 to-neutral-200 bg-clip-text text-xl font-medium text-transparent md:text-2xl">
          {card.title}
        </div>
      </div>
    </div>
  );
});

export const FocusCardContainer: AceternityComponent<{ items: FocusCardItem[] }> = ({ items }) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-10 md:grid-cols-3 md:px-8">
      {items.map((card, index) => (
        <FocusCard key={`${card.title}-${index}`} card={card} index={index} hovered={hovered} setHovered={setHovered} />
      ))}
    </div>
  );
};

export type FocusCardProps = {
  card: FocusCardItem;
  index: number;
  hovered: number | null;
  setHovered: React.Dispatch<React.SetStateAction<number | null>>;
};

export type FocusCardItem = { id: React.Key; title: string; src: string };
