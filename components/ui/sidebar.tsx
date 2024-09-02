'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { IconMenu2, IconX } from '@tabler/icons-react';
import Link, { LinkProps } from 'next/link';
import { createContext, useContext, useState } from 'react';

import { cn } from '@/lib/utils';

const SidebarContext = createContext<SidebarContextProps>({
  open: false,
  setOpen: () => {},
  animate: false
});

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) throw new Error('useSidebar must be used within a SidebarProvider');
  return context;
};

export const SidebarProvider: AceternityComponent<Partial<SidebarContextProps>> = ({
  children,
  open,
  setOpen,
  animate = true
}) => {
  const [openState, setOpenState] = useState(false);

  return (
    <SidebarContext.Provider value={{ open: open ?? openState, setOpen: setOpen ?? setOpenState, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar: AceternityComponent<Partial<SidebarContextProps>> = ({ children, open, setOpen, animate }) => (
  <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
    {children}
  </SidebarProvider>
);

export const SidebarBody: AceternityComponent<React.ComponentProps<typeof motion.div>> = (props) => (
  <>
    <DesktopSidebar {...props} />
    <MobileSidebar {...(props as React.ComponentProps<'div'>)} />
  </>
);

export const DesktopSidebar: AceternityComponent<React.ComponentProps<typeof motion.div>> = ({
  className,
  children,
  ...props
}) => {
  const { open, setOpen, animate } = useSidebar();

  return (
    <motion.div
      className={cn(
        'hidden h-full w-[300px] flex-shrink-0 bg-neutral-100 px-4 py-4 md:flex md:flex-col dark:bg-neutral-800',
        className
      )}
      animate={{ width: animate ? (open ? '300px' : '60px') : '300px' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({ className, children, ...rest }: React.ComponentProps<'div'>) => {
  const { open, setOpen } = useSidebar();

  return (
    <div
      className={cn(
        'flex h-10 w-full flex-row items-center justify-between bg-neutral-100 px-4 py-4 md:hidden dark:bg-neutral-800'
      )}
      {...rest}
    >
      <div className="z-20 flex w-full justify-end">
        <IconMenu2 className="text-neutral-800 dark:text-neutral-200" onClick={() => setOpen(!open)} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={cn(
              'fixed inset-0 z-[100] flex h-full w-full flex-col justify-between bg-white p-10 dark:bg-neutral-900',
              className
            )}
          >
            <div
              className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200"
              onClick={() => setOpen(!open)}
            >
              <IconX />
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SidebarLink: AceternityComponent<{ link: Links; props?: LinkProps }> = ({ link, className, ...rest }) => {
  const { open, animate } = useSidebar();

  return (
    <Link
      href={link.href}
      className={cn('group/sidebar flex items-center justify-start gap-2 py-2', className)}
      {...rest}
    >
      {link.icon}

      <motion.span
        animate={{
          display: animate ? (open ? 'inline-block' : 'none') : 'inline-block',
          opacity: animate ? (open ? 1 : 0) : 1
        }}
        className="!m-0 inline-block whitespace-pre !p-0 text-sm text-neutral-700 transition duration-150 group-hover/sidebar:translate-x-1 dark:text-neutral-200"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};

type Links = { label: string; href: string; icon: StringNode };

type SidebarContextProps = { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>; animate: boolean };
