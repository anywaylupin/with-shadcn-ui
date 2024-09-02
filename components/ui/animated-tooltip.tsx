'use client';

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

import Image from 'next/image';
import { useState } from 'react';

export const AnimatedTooltip: AceternityComponent<AnimatedTooltipProps> = ({ items, stiffness = 100, damping = 5 }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const x = useMotionValue(0);
  const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), { stiffness, damping });
  const translateX = useSpring(useTransform(x, [-100, 100], [-50, 50]), { stiffness, damping });

  return (
    <>
      {items.map((item, index) => (
        <div
          aria-hidden
          className="group relative -mr-4"
          key={item.id}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence mode="popLayout">
            {hoveredIndex === index && (
              <motion.div
                role="tooltip"
                aria-live="polite"
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { type: 'spring', stiffness: 260, damping: 10 }
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{ translateX, rotate }}
                className="absolute -left-1/2 -top-16 z-50 flex translate-x-1/2 flex-col items-center justify-center whitespace-nowrap rounded-md bg-black px-4 py-2 text-xs shadow-xl"
              >
                <div className="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                <div className="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
                <div className="relative z-30 text-base font-bold text-white">{item.name}</div>
                <div className="text-xs text-white">{item.designation}</div>
              </motion.div>
            )}
          </AnimatePresence>

          <Image
            onMouseMove={(event) =>
              x.set(event.nativeEvent.offsetX - (event.target as HTMLImageElement).offsetWidth / 2)
            }
            height={100}
            width={100}
            src={item.image}
            alt={item.name}
            className="relative !m-0 h-14 w-14 rounded-full border-2 border-white object-cover object-top !p-0 transition duration-500 group-hover:z-30 group-hover:scale-105"
          />
        </div>
      ))}
    </>
  );
};

export type AnimatedTooltipItem = { id: React.Key; name: string; designation: string; image: string };

export type AnimatedTooltipProps = { items: AnimatedTooltipItem[]; stiffness?: number; damping?: number };
