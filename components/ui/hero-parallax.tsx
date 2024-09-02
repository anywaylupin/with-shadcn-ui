'use client';

import { MotionValue, motion, useScroll, useSpring, useTransform } from 'framer-motion';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export const HeroParallax: AceternityComponent<{ items: HeroParallaxItem[] }> = ({ items }) => {
  const firstRow = items.slice(0, 5);
  const secondRow = items.slice(5, 10);
  const thirdRow = items.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), springConfig);
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -1000]), springConfig);
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig);
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-700, 500]), springConfig);

  return (
    <div
      ref={ref}
      className="relative flex h-[300vh] flex-col self-auto overflow-hidden py-40 antialiased transform-3d [perspective:1000px]"
    >
      <Header />
      <motion.div style={{ rotateX, rotateZ, translateY, opacity }}>
        <motion.div className="mb-20 flex flex-row-reverse space-x-20 space-x-reverse">
          {firstRow.map((item) => (
            <ProductCard key={item.id} item={item} translate={translateX} />
          ))}
        </motion.div>
        <motion.div className="mb-20 flex flex-row space-x-20">
          {secondRow.map((item) => (
            <ProductCard key={item.id} item={item} translate={translateXReverse} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-20 space-x-reverse">
          {thirdRow.map((item) => (
            <ProductCard key={item.id} item={item} translate={translateX} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header: AceternityComponent = () => (
  <div className="relative left-0 top-0 mx-auto w-full max-w-7xl px-4 py-20 md:py-40">
    <h1 className="text-2xl font-bold md:text-7xl dark:text-white">
      The Ultimate <br /> development studio
    </h1>
    <p className="mt-8 max-w-2xl text-base md:text-xl dark:text-neutral-200">
      We build beautiful items with the latest technologies and frameworks. We are a team of passionate developers and
      designers that love to build amazing items.
    </p>
  </div>
);

export const ProductCard: AceternityComponent<{
  item: HeroParallaxItem;
  translate: MotionValue<number>;
}> = ({ item, translate }) => (
  <motion.div
    style={{ x: translate }}
    whileHover={{ y: -20 }}
    key={item.title}
    className="group/product relative h-96 w-[30rem] flex-shrink-0"
  >
    <Link href={item.link} className="block group-hover/product:shadow-2xl">
      <Image
        src={item.thumbnail}
        height="600"
        width="600"
        className="absolute inset-0 h-full w-full object-cover object-left-top"
        alt={item.title}
      />
    </Link>
    <div className="pointer-events-none absolute inset-0 h-full w-full bg-black opacity-0 group-hover/product:opacity-80"></div>
    <h2 className="absolute bottom-4 left-4 text-white opacity-0 group-hover/product:opacity-100">{item.title}</h2>
  </motion.div>
);

export type HeroParallaxItem = { id: React.Key; title: string; link: string; thumbnail: string };
