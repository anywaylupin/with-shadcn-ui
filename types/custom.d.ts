declare module 'tailwindcss/lib/util/flattenColorPalette' {
  export default function flattenColorPalette(pallette: Record<string, string>): Record<string, string>;
}

declare type Numberish = number | string;

declare type DirectionSide = 'top' | 'bottom' | 'left' | 'right';

declare type StringNode = JSX.Element | React.ReactNode | string;

declare type StateContextType<S = boolean> = [S, React.Dispatch<React.SetStateAction<S>>];

declare type PropsWithClass<P = unknown> = React.PropsWithChildren<
  { className?: string; containerClassName?: string } & P
>;
