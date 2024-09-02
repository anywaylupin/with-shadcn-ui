declare module 'tailwindcss/lib/util/flattenColorPalette' {
  export default function flattenColorPalette(pallette: Record<string, string>): Record<string, string>;
}

declare type Numberish = React.Key;

declare type DirectionSide = 'top' | 'bottom' | 'left' | 'right';

declare type MinMaxValue = { min?: number; max?: number };

declare type StringNode = JSX.Element | React.ReactNode | string;

declare type StateContextType<S = boolean> = [S, React.Dispatch<React.SetStateAction<S>>];

declare type PropsWithClass<P = {}, T = undefined> = React.PropsWithChildren<
  { className?: string; containerClassName?: string } & P
> &
  (T extends undefined ? {} : React.HTMLProps<T>);

declare type AceternityComponent<P = {}, T = undefined> = React.FC<PropsWithClass<P, T>>;
