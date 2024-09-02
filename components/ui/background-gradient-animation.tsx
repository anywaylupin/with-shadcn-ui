'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { useSafari } from '@/hooks';

type BackgroundGradientAnimationProps = {
  start?: string;
  end?: string;
  first?: string;
  second?: string;
  third?: string;
  fourth?: string;
  fifth?: string;
  pointerColor?: string;
  size?: string;
  blendingValue?: string;
  interactive?: boolean;
};

export const BackgroundGradientAnimation: AceternityComponent<BackgroundGradientAnimationProps> = ({
  start = 'rgb(108, 0, 162)',
  end = 'rgb(0, 17, 82)',
  first = '18, 113, 255',
  second = '221, 74, 255',
  third = '100, 220, 255',
  fourth = '200, 50, 50',
  fifth = '180, 180, 50',
  pointerColor = '140, 100, 255',
  size = '80%',
  blendingValue = 'hard-light',
  children,
  className,
  containerClassName,
  interactive = false
}) => {
  const interactiveRef = useRef<HTMLDivElement>(null);

  const [curX, setCurX] = useState(0);
  const [curY, setCurY] = useState(0);
  const [tgX, setTgX] = useState(0);
  const [tgY, setTgY] = useState(0);

  useEffect(() => {
    document.body.style.setProperty('--gradient-background-start', start);
    document.body.style.setProperty('--gradient-background-end', end);
    document.body.style.setProperty('--first-color', first);
    document.body.style.setProperty('--second-color', second);
    document.body.style.setProperty('--third-color', third);
    document.body.style.setProperty('--fourth-color', fourth);
    document.body.style.setProperty('--fifth-color', fifth);
    document.body.style.setProperty('--pointer-color', pointerColor);
    document.body.style.setProperty('--size', size);
    document.body.style.setProperty('--blending-value', blendingValue);
  }, [blendingValue, end, fifth, first, fourth, pointerColor, second, size, start, third]);

  useEffect(() => {
    if (!interactiveRef.current) return;
    setCurX((curX) => curX + (tgX - curX) / 20);
    setCurY((curY) => curY + (tgY - curY) / 20);
    interactiveRef.current.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tgX, tgY]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!interactiveRef.current) return;
    const rect = interactiveRef.current.getBoundingClientRect();
    setTgX(event.clientX - rect.left);
    setTgY(event.clientY - rect.top);
  };

  const [isSafari] = useSafari();

  return (
    <div
      className={cn(
        'relative left-0 top-0 h-screen w-screen overflow-hidden bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]',
        containerClassName
      )}
    >
      <svg className="hidden">
        <defs>
          <filter id="blurMe">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div className={className}>{children}</div>
      <div
        className={cn(
          'gradients-container h-full w-full blur-lg',
          isSafari ? 'blur-2xl' : '[filter:url(#blurMe)_blur(40px)]'
        )}
      >
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_var(--first-color)_0,_var(--first-color)_50%)_no-repeat]`,
            `left-[calc(50%-var(--size)/2)] top-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] [mix-blend-mode:var(--blending-value)]`,
            `[transform-origin:center_center]`,
            `animate-first`,
            `opacity-100`
          )}
        ></div>
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--second-color),_0.8)_0,_rgba(var(--second-color),_0)_50%)_no-repeat]`,
            `left-[calc(50%-var(--size)/2)] top-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] [mix-blend-mode:var(--blending-value)]`,
            `[transform-origin:calc(50%-400px)]`,
            `animate-second`,
            `opacity-100`
          )}
        ></div>
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--third-color),_0.8)_0,_rgba(var(--third-color),_0)_50%)_no-repeat]`,
            `left-[calc(50%-var(--size)/2)] top-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] [mix-blend-mode:var(--blending-value)]`,
            `[transform-origin:calc(50%+400px)]`,
            `animate-third`,
            `opacity-100`
          )}
        ></div>
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--fourth-color),_0.8)_0,_rgba(var(--fourth-color),_0)_50%)_no-repeat]`,
            `left-[calc(50%-var(--size)/2)] top-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] [mix-blend-mode:var(--blending-value)]`,
            `[transform-origin:calc(50%-200px)]`,
            `animate-fourth`,
            `opacity-70`
          )}
        ></div>
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--fifth-color),_0.8)_0,_rgba(var(--fifth-color),_0)_50%)_no-repeat]`,
            `left-[calc(50%-var(--size)/2)] top-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] [mix-blend-mode:var(--blending-value)]`,
            `[transform-origin:calc(50%-800px)_calc(50%+800px)]`,
            `animate-fifth`,
            `opacity-100`
          )}
        ></div>

        {interactive && (
          <div
            aria-hidden
            ref={interactiveRef}
            onMouseMove={handleMouseMove}
            className={cn(
              `absolute [background:radial-gradient(circle_at_center,_rgba(var(--pointer-color),_0.8)_0,_rgba(var(--pointer-color),_0)_50%)_no-repeat]`,
              `-left-1/2 -top-1/2 h-full w-full [mix-blend-mode:var(--blending-value)]`,
              `opacity-70`
            )}
          ></div>
        )}
      </div>
    </div>
  );
};
