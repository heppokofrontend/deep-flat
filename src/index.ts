import safeStringify from 'fast-safe-stringify';

export namespace FlatDeep {
  /** The option of FlatDeep. */
  export type options = {
    /** Whether to ignore the string type */
    stringIgnore?: boolean,
    /** If a circular reference is found, convert it to JSON without ignoring it */
    circularReferenceToJson?: boolean,
  };
};

/**
 * Determine if flatable
 * @param arg - Variables to be checked
 * @returns - Judgment result
 */
const isFlatable = (arg: any) => {
  if (!arg) {
    return false;
  }

  return arg[Symbol.iterator];
};

/** The default option config of flatDeep */
const defaultOptions: FlatDeep.options = {
  stringIgnore: true,
  circularReferenceToJson: false,
};

/**
 * Check if it's an ignorable string
 * @param options - The option of flatDeep
 * @param current - The current object of callback function in Array.reduce
 * @returns - Judgment result
 */
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

/**
 * Check if it's an ignorable object
 * @param options - The option of flatDeep
 * @param current - The current object of callback function in Array.reduce
 * @param isWatched - Whether there is a suspicion of circulatory reference
 * @returns - Judgment result
 */
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
 * @param argIterableObj - The iterable object to flatten
 * @param options - options
 * @returns - Completely Flattened array
 */
export const flatDeep = <T = any>(argIterableObj: Iterable<any>, options: FlatDeep.options = defaultOptions): T[] => {
  /**
   * In order to avoid circular references, the object once checked by
   * the flatDeep (loop) function should be ignored.
   * This Set object is used to manage the confirmed objects.
   */
  const duplicateObjects = new Set<any>([argIterableObj]);
  /**
   * The functions that are recursively called continuously
   * @param items - The iterable object to flatten
   * @returns - A completely flattened array
   */
  const loop = (items: any[]): T[] => {
    /**
     * The callback function of Array.prototype.reduce
     * @param acc - The accumulator accumulates callbackFn's return values
     * @param current - The current element being processed in the array
     * @returns - A flattened array
     */
    const callback = (acc: any[], current: any) => {
      const isWatched = duplicateObjects.has(current);

      if (
        isIgnorableString(options, current) ||
        isIgnorableObject(options, current, isWatched)
      ) {
        return acc.concat(current);
      }

      if (typeof current === 'object') {
        duplicateObjects.add(current);

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

  return loop([...argIterableObj]);
};
