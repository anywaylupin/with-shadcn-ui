'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useRef } from 'react';

export const ParallaxScroll: AceternityComponent<{
  items: { id: React.Key; src: string }[];
}> = ({ items, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: ref, offset: ['start start', 'end start'] });

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const third = Math.ceil(items.length / 3);

  const firstPart = items.slice(0, third);
  const secondPart = items.slice(third, 2 * third);
  const thirdPart = items.slice(2 * third);

  return (
    <div className={cn('h-[40rem] w-full items-start overflow-y-auto', className)} ref={ref}>
      <div
        ref={ref}
        className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-10 px-10 py-40 md:grid-cols-2 lg:grid-cols-3"
      >
        <div className="grid gap-10">
          {firstPart.map((item) => (
            <motion.div style={{ y: translateFirst }} key={item.id}>
              <Image
                src={item.src}
                className="!m-0 h-80 w-full gap-10 rounded-lg object-cover object-left-top !p-0"
                height="400"
                width="400"
                alt="thumbnail"
              />
            </motion.div>
          ))}
        </div>
        <div className="grid gap-10">
          {secondPart.map((item) => (
            <motion.div style={{ y: translateSecond }} key={item.id}>
              <Image
                src={item.src}
                className="!m-0 h-80 w-full gap-10 rounded-lg object-cover object-left-top !p-0"
                height="400"
                width="400"
                alt="thumbnail"
              />
            </motion.div>
          ))}
        </div>
        <div className="grid gap-10">
          {thirdPart.map((item) => (
            <motion.div style={{ y: translateThird }} key={item.id}>
              <Image
                src={item.src}
                className="!m-0 h-80 w-full gap-10 rounded-lg object-cover object-left-top !p-0"
                height="400"
                width="400"
                alt="thumbnail"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
