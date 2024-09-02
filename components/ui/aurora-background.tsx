'use client';

import { cn } from '@/lib/utils';

export const AuroraBackground: AceternityComponent<{ showRadialGradient?: boolean }, HTMLDivElement> = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}) => (
  <div
    className={cn(
      'transition-bg relative flex h-[100vh] flex-col items-center justify-center bg-zinc-50 text-slate-950 dark:bg-zinc-900',
      className
    )}
    {...props}
  >
    <div className="absolute inset-0 overflow-hidden">
      <div
        //   I'm sorry but this is what peak developer performance looks like // trigger warning
        className={cn(
          `bg-aurora pointer-events-none absolute -inset-[10px] opacity-50 blur-[10px] invert filter will-change-transform after:absolute after:inset-0 after:animate-aurora after:mix-blend-difference dark:invert-0 dark:[background-image:var(--dark-gradient),var(--aurora)] after:dark:[background-image:var(--dark-gradient),var(--aurora)]`,
          { '[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]': showRadialGradient }
        )}
      ></div>
    </div>
    {children}
  </div>
);
