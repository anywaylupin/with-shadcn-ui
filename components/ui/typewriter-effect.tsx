'use client';

import { motion, stagger, useAnimate, useInView } from 'framer-motion';

import { cn } from '@/lib/utils';
import { useEffect } from 'react';

const convertToArray = (words: TypewriterEffectWords[]) =>
  words.map((word) => ({ ...word, text: word.text.split('') }));

export const TypewriterEffect: AceternityComponent<TypewriterEffectProps> = ({ words, className, cursorClassName }) => {
  const wordsArray = convertToArray(words);

  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);
  useEffect(() => {
    animate(
      'span',
      { display: 'inline-block', opacity: 1, width: 'fit-content' },
      { duration: 0.3, delay: stagger(0.1), ease: 'easeInOut' }
    );
  }, [animate, isInView]);

  return (
    <div className={cn('text-center text-base font-bold sm:text-xl md:text-3xl lg:text-5xl', className)}>
      <motion.div ref={scope} className="inline">
        {wordsArray.map((word, idx) => (
          <div key={`word-${idx}`} className="inline-block">
            {word.text.map((char, index) => (
              <span key={`char-${index}`} className={cn(`hidden text-black opacity-0 dark:text-white`, word.className)}>
                {char}
              </span>
            ))}
            &nbsp;
          </div>
        ))}
      </motion.div>

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
        className={cn('inline-block h-4 w-[4px] rounded-sm bg-blue-500 md:h-6 lg:h-10', cursorClassName)}
      ></motion.span>
    </div>
  );
};

export const TypewriterEffectSmooth: AceternityComponent<TypewriterEffectProps> = ({
  words,
  className,
  cursorClassName
}) => {
  const wordsArray = convertToArray(words);

  return (
    <div className={cn('my-6 flex space-x-1', className)}>
      <motion.div
        className="overflow-hidden pb-2"
        initial={{ width: '0%' }}
        whileInView={{ width: 'fit-content' }}
        transition={{ duration: 2, ease: 'linear', delay: 1 }}
      >
        <div className="lg:text:3xl whitespace-nowrap text-xs font-bold sm:text-base md:text-xl xl:text-5xl">
          {
            <div>
              {wordsArray.map((word, idx) => (
                <div key={`word-${idx}`} className="inline-block">
                  {word.text.map((char, index) => (
                    <span key={`char-${index}`} className={cn(`text-black dark:text-white`, word.className)}>
                      {char}
                    </span>
                  ))}
                  &nbsp;
                </div>
              ))}
            </div>
          }{' '}
        </div>{' '}
      </motion.div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
        className={cn('block h-4 w-[4px] rounded-sm bg-blue-500 sm:h-6 xl:h-12', cursorClassName)}
      ></motion.span>
    </div>
  );
};

type TypewriterEffectWords = { id: React.Key; text: string; className?: string };
type TypewriterEffectProps = { words: TypewriterEffectWords[]; cursorClassName?: string };
