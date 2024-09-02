// Input component extends from shadcnui - https://ui.shadcn.com/docs/components/input
'use client';

import { forwardRef, useCallback, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

import { cn } from '@/lib/utils';

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { radius?: number }>(
  function Input({ className, type, radius = 100, ...props }, ref) {
    const [visible, setVisible] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = useCallback<React.MouseEventHandler<HTMLDivElement>>(
      ({ currentTarget, clientX, clientY }) => {
        const { left, top } = currentTarget.getBoundingClientRect();

        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
      },
      [mouseX, mouseY]
    );

    const gradientBackground = useMotionTemplate`radial-gradient(${visible ? radius : 0}px circle at ${mouseX}px ${mouseY}px,var(--blue-500),transparent 80%)`;

    return (
      <motion.div
        style={{ background: gradientBackground }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="group/input rounded-lg p-[2px] transition duration-300"
      >
        <input
          type={type}
          className={cn(
            `duration-400 flex h-10 w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black shadow-input transition group-hover/input:shadow-none`,
            `placeholder:text-neutral-400`,
            `file:border-0 file:bg-transparent file:text-sm file:font-medium`,
            `focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-400`,
            `disabled:cursor-not-allowed disabled:opacity-50`,
            `dark:placeholder-text-neutral-600 dark:bg-zinc-800 dark:text-white dark:shadow-[0px_0px_1px_1px_var(--neutral-700)] dark:focus-visible:ring-neutral-600`,
            className
          )}
          ref={ref}
          {...props}
        />
      </motion.div>
    );
  }
);
