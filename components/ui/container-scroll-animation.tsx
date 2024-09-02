'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

export const ContainerScroll: AceternityComponent<{ title: StringNode }> = ({
  title,
  children,
  className,
  containerClassName
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scaleDimensions = useCallback(() => (isMobile ? [0.7, 0.9] : [1.05, 1]), [isMobile]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translateY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      ref={ref}
      className={cn('relative flex h-[60rem] items-center justify-center p-2 md:h-[80rem] md:p-20', containerClassName)}
    >
      <div className="relative w-full py-10 md:py-40" style={{ perspective: '1000px' }}>
        <motion.div style={{ translateY }} className="div mx-auto max-w-5xl text-center">
          {title}
        </motion.div>

        <motion.div
          style={{ rotateX, scale }}
          className={cn(
            'aceternity-container-scroll mx-auto -mt-12 h-[30rem] w-full max-w-5xl p-2 md:h-[40rem] md:p-6',
            className
          )}
        >
          <div className="h-full w-full overflow-hidden rounded-2xl bg-gray-100 md:rounded-2xl md:p-4 dark:bg-zinc-900">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
