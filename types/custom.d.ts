declare module 'tailwindcss/lib/util/flattenColorPalette';

declare type Numberish = number | string;

declare type ComponentProps<P = unknown> = React.PropsWithChildren<
  { className?: string; containerClassName?: string } & P
>;
