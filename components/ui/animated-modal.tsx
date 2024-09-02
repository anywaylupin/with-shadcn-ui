'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { useOutsideClick } from '@/hooks';

export const ModalContext = createContext<StateContextType>([false, () => {}]);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export const Modal: AceternityComponent = ({ children }) => {
  const [open, setOpen] = useState(false);
  const providerValue = useMemo<StateContextType>(() => [open, setOpen], [open]);

  return <ModalContext.Provider value={providerValue}>{children}</ModalContext.Provider>;
};

export const ModalTrigger: AceternityComponent = ({ children, className }) => {
  const [, setOpen] = useModal();

  return (
    <button
      className={cn('relative overflow-hidden rounded-md px-4 py-2 text-center text-black dark:text-white', className)}
      onClick={() => setOpen(true)}
    >
      {children}
    </button>
  );
};

export const ModalBody: AceternityComponent = ({ children, className }) => {
  const [open, setOpen] = useModal();

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'auto';
  }, [open]);

  const ref = useRef(null);
  useOutsideClick(ref, () => setOpen(false));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          className="fixed inset-0 z-50 flex h-full w-full items-center justify-center transform-3d [perspective:800px]"
        >
          <Overlay />

          <motion.div
            ref={ref}
            className={cn(
              'relative z-50 flex max-h-[90%] min-h-[50%] flex-1 flex-col overflow-hidden border border-transparent bg-white md:max-w-[40%] md:rounded-2xl dark:border-neutral-800 dark:bg-neutral-950',
              className
            )}
            initial={{ opacity: 0, scale: 0.5, rotateX: 40, y: 40 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateX: 10 }}
            transition={{ type: 'spring', stiffness: 260, damping: 15 }}
          >
            <CloseIcon />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ModalContent: AceternityComponent = ({ children, className }) => (
  <div className={cn('flex flex-1 flex-col p-8 md:p-10', className)}>{children}</div>
);

export const ModalFooter: AceternityComponent = ({ children, className }) => (
  <div className={cn('flex justify-end bg-gray-100 p-4 dark:bg-neutral-900', className)}>{children}</div>
);

const Overlay: AceternityComponent = ({ className }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
    exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
    className={`fixed inset-0 z-50 h-full w-full bg-black bg-opacity-50 ${className}`}
  ></motion.div>
);

const CloseIcon: AceternityComponent = () => {
  const [, setOpen] = useModal();

  return (
    <button onClick={() => setOpen(false)} className="group absolute right-4 top-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 text-black transition duration-200 group-hover:rotate-3 group-hover:scale-125 dark:text-white"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M18 6l-12 12" />
        <path d="M6 6l12 12" />
      </svg>
    </button>
  );
};
