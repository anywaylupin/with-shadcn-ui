'use client';

import * as HoverCardPrimitive from '@radix-ui/react-hover-card';

import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { encode } from 'qss';

export const LinkPreview: AceternityComponent<LinkPreviewProps> = ({
  children,
  url,
  className,
  width = 200,
  height = 125,
  quality = 50,
  stiffness = 100,
  damping = 15,
  isStatic = false,
  imageSrc = ''
}) => {
  let src;
  if (!isStatic) {
    const params = encode({
      url,
      screenshot: true,
      meta: false,
      embed: 'screenshot.url',
      colorScheme: 'dark',
      'viewport.isMobile': true,
      'viewport.deviceScaleFactor': 1,
      'viewport.width': width * 3,
      'viewport.height': height * 3
    });
    src = `https://api.microlink.io/?${params}`;
  } else {
    src = imageSrc;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const x = useMotionValue(0);
  const translateX = useSpring(x, { stiffness, damping });

  const handleMouseMove = useCallback<React.MouseEventHandler<HTMLAnchorElement>>(
    (event) => {
      const targetRect = (event.target as HTMLAnchorElement).getBoundingClientRect();
      const eventOffsetX = event.clientX - targetRect.left;
      const offsetFromCenter = (eventOffsetX - targetRect.width / 2) / 2; // Reduce the effect to make it subtle
      x.set(offsetFromCenter);
    },
    [x]
  );

  return (
    <>
      {isMounted && (
        <div className="hidden">
          <Image src={src} width={width} height={height} quality={quality} priority alt="hidden image" />
        </div>
      )}

      <HoverCardPrimitive.Root openDelay={50} closeDelay={100} onOpenChange={(open) => setIsOpen(open)}>
        <HoverCardPrimitive.Trigger
          onMouseMove={handleMouseMove}
          className={cn('text-black dark:text-white', className)}
          href={url}
        >
          {children}
        </HoverCardPrimitive.Trigger>

        <HoverCardPrimitive.Content
          className="[transform-origin:var(--radix-hover-card-content-transform-origin)]"
          side="top"
          align="center"
          sideOffset={10}
        >
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { type: 'spring', stiffness: 260, damping: 20 }
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                className="rounded-xl shadow-xl"
                style={{ x: translateX }}
              >
                <Link
                  href={url}
                  className="block rounded-xl border-2 border-transparent bg-white p-1 text-[0] shadow hover:border-neutral-200 dark:hover:border-neutral-800"
                >
                  <Image
                    src={isStatic ? imageSrc : src}
                    width={width}
                    height={height}
                    quality={quality}
                    priority={true}
                    className="rounded-lg"
                    alt="preview image"
                  />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Root>
    </>
  );
};

type LinkPreviewProps = {
  children: React.ReactNode;
  url: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  stiffness?: number;
  damping?: number;
} & ({ isStatic: true; imageSrc: string } | { isStatic?: false; imageSrc?: never });
