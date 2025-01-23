'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export const ModeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button variant="link" type="button" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      <Sun className="text-neutral-800 dark:hidden dark:text-neutral-200" />
      <Moon className="hidden text-neutral-800 dark:block dark:text-neutral-200" />
    </Button>
  );
};
