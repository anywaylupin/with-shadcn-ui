import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export type BackgroundGradientProps = PropsWithClass<{ animate?: boolean; colors?: string[] }>;

const generateGradient = (colors: string[]): string => {
  const positions = [
    'circle farthest-side at 0% 100%',
    'circle farthest-side at 100% 0%',
    'circle farthest-side at 100% 100%',
    'circle farthest-side at 0% 0%'
  ];

  return colors
    .map((color, index) => `radial-gradient(${positions[index % positions.length]}, ${color}, transparent)`)
    .join(', ');
};

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
  colors = ['#00ccb1', '#7b61ff', '#ffc414', '#1ca0fb']
}: BackgroundGradientProps) => {
  const backgroundImage = generateGradient(colors);

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
        style={{ backgroundSize: animate ? '400% 400%' : undefined, backgroundImage }}
        className={cn(
          'absolute inset-0 z-[1] rounded-3xl opacity-60 blur-xl transition duration-500 will-change-transform group-hover:opacity-100'
        )}
      />
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? 'initial' : undefined}
        animate={animate ? 'animate' : undefined}
        transition={animate ? { duration: 5, repeat: Infinity, repeatType: 'reverse' } : undefined}
        style={{ backgroundSize: animate ? '400% 400%' : undefined, backgroundImage }}
        className={cn('absolute inset-0 z-[1] rounded-3xl will-change-transform')}
      />

      <div className={cn('relative z-10', className)}>{children}</div>
    </div>
  );
};
