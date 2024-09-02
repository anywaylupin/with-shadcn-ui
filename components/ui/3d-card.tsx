'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

export const MouseEnterContext = createContext<StateContextType>([false, () => {}]);

export const useMouseEnter = () => {
  const context = useContext(MouseEnterContext);
  if (!context) {
    throw new Error('useMouseEnter must be used within a MouseEnterProvider');
  }
  return context;
};

export const CardContainer: AceternityComponent = ({ children, className, containerClassName }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [mouseEntered, setMouseEntered] = useState(false);

  const providerValue = useMemo<StateContextType>(() => [mouseEntered, setMouseEntered], [mouseEntered]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    ref.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!ref.current) return;
    setMouseEntered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    setMouseEntered(false);
    ref.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
  }, []);

  return (
    <MouseEnterContext.Provider value={providerValue}>
      <div
        className={cn('flex items-center justify-center py-20', containerClassName)}
        style={{ perspective: '1000px' }}
      >
        <div
          ref={ref}
          aria-hidden
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn('relative flex items-center justify-center transition-all duration-200 ease-linear', className)}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};

export const CardBody: AceternityComponent = ({ children, className }) => (
  <div className={cn('h-96 w-96 transform-3d [&>*]:transform-3d', className)}>{children}</div>
);

export const CardItem: AceternityComponent<CardItemProps> = ({
  as: Tag = 'div',
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [mouseEntered] = useMouseEnter();

  const handleAnimations = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = mouseEntered
      ? `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
      : `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
  }, [mouseEntered, rotateX, rotateY, rotateZ, translateX, translateY, translateZ]);

  useEffect(() => handleAnimations(), [handleAnimations]);

  return (
    <Tag ref={ref} className={cn('w-fit transition duration-200 ease-linear', className)} {...rest}>
      {children}
    </Tag>
  );
};

type CardItemProps = {
  as?: React.ElementType;
  translateX?: Numberish;
  translateY?: Numberish;
  translateZ?: Numberish;
  rotateX?: Numberish;
  rotateY?: Numberish;
  rotateZ?: Numberish;
  [key: string]: unknown;
};
