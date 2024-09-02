/**
 * Removes all falsy values from an array.
 * @param array - The array to compact.
 * @returns A new array with all falsy values removed.
 */
export const compact = <T>(array: T[]) =>
  array.filter(Boolean as unknown as (value: T) => value is Exclude<T, false | null | undefined | 0 | ''>);

/**
 * Splits an array into chunks of the specified size.
 * @param array - The array to chunk.
 * @param size - The size of each chunk. Defaults to 1.
 * @returns A new array with the chunks.
 */
export const chunk = <T>(array: T[], size = 1): T[][] => [array.slice(0, size)].concat(chunk(array.slice(size), size));

/**
 * Merges multiple arrays and values into a single array.
 * @param array - The initial array.
 * @param args - Additional arrays or values to merge.
 * @returns A new array with all values merged.
 */
export const merge = <T>(array: T[], ...args: unknown[]) => [...array, ...args.flat()] as T[];

/**
 * Gets the last element of an array.
 * @param array - The array to get the last element from.
 * @returns The last element of the array.
 */
export const last = <T>(array: T[]) => array[array.length - 1];

/**
 * Removes duplicate values from an array.
 * @param array - The array to remove duplicates from.
 * @param sort - Whether to sort the resulting array. Defaults to false.
 * @returns A new array with unique values.
 */
export const uniq = <T>(array: T[], sort = false) => {
  const uniqueArray = Array.from(new Set(array));
  return sort
    ? uniqueArray.sort((a, b) => {
        if (a === b) return 0;
        else return a > b ? 1 : -1;
      })
    : uniqueArray;
};

/**
 * Creates an array of numbers from 0 to size - 1.
 * @param size - The size of the array.
 * @returns A new array of numbers.
 */
export const range = (size: number): number[] => Array.from({ length: size }, (_, i) => i);

/**
 * Finds the intersection of multiple arrays.
 * @param args - The arrays to intersect.
 * @returns A new array with the common values.
 */
export const intersection = <T>(...args: T[][]) => {
  if (args.length === 0) return [];
  return args.reduce((acc, array) => acc.filter((item) => array.includes(item)));
};

/**
 * Finds the difference between the first array and the rest of the arrays.
 * @param args - The arrays to find the difference.
 * @returns A new array with the different values.
 */
export const diff = <T>(...args: T[][]) => {
  if (args.length === 0) return [];
  const [first, ...rest] = args;
  const restFlat = rest.flat();
  return first.filter((item) => !restFlat.includes(item));
};

/**
 * Excludes specified values from an array.
 * @param array - The array to exclude values from.
 * @param args - The values to exclude.
 * @returns A new array with the excluded values removed.
 */
export const allBut = <T>(array: T[], ...args: (T | unknown)[]) => array.filter((value) => !args.includes(value));

/**
 * Returns all elements of an array except the first one.
 * @param array - The array to get all elements except the first one.
 * @returns A new array with all elements except the first one.
 */
export const allButFirst = <T>([, ...rest]: T[]) => rest;

/**
 * Gets a random element from an array.
 * @param array - The array to get a random element from.
 * @returns A random element from the array.
 */
export const getRandomElement = <T>(array: T[]) => array[Math.floor(Math.random() * array.length)];
