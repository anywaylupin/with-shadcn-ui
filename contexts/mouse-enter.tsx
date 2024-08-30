import { createContext, useRef } from 'react';

export type MouseEnterContextValue = [boolean, React.Dispatch<React.SetStateAction<boolean>>];

export const MouseEnterContext = createContext<MouseEnterContextValue>([false, () => false]);
