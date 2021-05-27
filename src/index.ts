import safeStringify from 'fast-safe-stringify';

export namespace FlatDeep {
  /** The option of FlatDeep */
  export type options = {
    /** Whether to ignore the string type */
    stringIgnore?: boolean,
    /** If a circular reference is found, convert it to JSON without ignoring it. */
    circularReferenceToJson?: boolean,
  };
};

/**
 * Determine if flatable.
 * @param arg - Variables to be checked
 * @returns - Judgment result
 */
export const isFlatable = (arg: any) => {
  if (!arg) {
    return false;
  }

  return arg[Symbol.iterator];
};

const defaultOptions = {
  stringIgnore: true,
  circularReferenceToJson: false,
};

const isIgnorableString = (options: FlatDeep.options, current: any) => (
  typeof current === 'string' &&
  (
    (
      (options.stringIgnore ?? true) ||
      current.length < 2
    ) ||
    current === '[Circular]'
  )
);

const isIgnorableObject = (options: FlatDeep.options, current: any, isWatched: boolean) => (
  typeof current !== 'string' &&
  (
    (
      isWatched &&
      !options.circularReferenceToJson
    ) ||
    !isFlatable(current)
  )
);

/**
 * Flatten iterable object
 * @param arg - The iterable object to flatten
 * @param options - options
 * @returns - Completely Flattened array
 */
export const flatDeep = <T = any>(iterable: Iterable<any>, options: FlatDeep.options = defaultOptions): T[] => {
  const circularReferenceObjects = new Set<any>([iterable]);
  /**
   * @param items - The iterable object to flatten
   * @returns - A completely flattened array.
   */
  const loop = (items: any[]): T[] => {
    /**
     * The callback function of Array.prototype.reduce
     * @param acc - The accumulator accumulates callbackFn's return values.
     * @param current - The current element being processed in the array.
     * @returns - A flattened array.
     */
    const callback = (acc: any[], current: any) => {
      const isWatched = circularReferenceObjects.has(current);

      if (
        isIgnorableString(options, current) ||
        isIgnorableObject(options, current, isWatched)
      ) {
        return acc.concat(current);
      }

      if (typeof current === 'object') {
        circularReferenceObjects.add(current);

        if (
          isWatched &&
          options.circularReferenceToJson
        ) {
          return acc.concat(loop([...JSON.parse(safeStringify(current))]));
        }
      }

      return acc.concat(loop([...current]));
    };

    return items.reduce(callback, []);
  };

  return loop([...iterable]);
};
