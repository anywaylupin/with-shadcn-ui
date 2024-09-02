import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

export const BackgroundGradient: AceternityComponent<{ animate?: boolean; colors?: string[] }> = ({
  children,
  className,
  containerClassName,
  animate = true,
  colors = ['#00ccb1', '#7b61ff', '#ffc414', '#1ca0fb']
}) => {
  const backgroundImage = useMemo(() => {
    const positions = [
      'circle farthest-side at 0% 100%',
      'circle farthest-side at 100% 0%',
      'circle farthest-side at 100% 100%',
      'circle farthest-side at 0% 0%'
    ];

    return colors
      .map((color, index) => `radial-gradient(${positions[index % positions.length]}, ${color}, transparent)`)
      .join(', ');
  }, [colors]);

  const variants = {
    initial: { backgroundPosition: '0 50%' },
    animate: { backgroundPosition: ['0 50%', '100% 50%', '0 50%'] }
  };

  return (
    <div className={cn('group relative w-max p-[4px]', containerClassName)}>
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? 'initial' : undefined}
        animate={animate ? 'animate' : undefined}
        transition={animate ? { duration: 5, repeat: Infinity, repeatType: 'reverse' } : undefined}
        style={{ backgroundImage }}
        className={cn(
          'absolute inset-0 z-[1] rounded-3xl opacity-60 blur-xl transition duration-500 will-change-transform group-hover:opacity-100',
          { 'bg-[length:400%_400%]': animate }
        )}
      />
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? 'initial' : undefined}
        animate={animate ? 'animate' : undefined}
        transition={animate ? { duration: 5, repeat: Infinity, repeatType: 'reverse' } : undefined}
        style={{ backgroundImage }}
        className={cn('absolute inset-0 z-[1] rounded-3xl will-change-transform', { 'bg-[length:400%_400%]': animate })}
      />

      <div className={cn('relative z-10', className)}>{children}</div>
    </div>
  );
};
