declare module 'tailwindcss/lib/util/flattenColorPalette';

declare type Numberish = number | string;

declare type StateContextType<S = boolean> = [S, React.Dispatch<React.SetStateAction<S>>];

declare type PropsWithClass<P = unknown> = React.PropsWithChildren<
  { className?: string; containerClassName?: string } & P
>;
