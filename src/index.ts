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
 * @param isStringIgnore - Whether to ignore the string type
 * @returns - Judgment result
 */
export const isFlatable = (arg: any, isStringIgnore: boolean) => {
  if (!arg) {
    return false;
  }

  if (typeof arg === 'string') {
    if (isStringIgnore) {
      return false;
    }

    // If the string is less than two character,
    // it must return false, otherwise it will cause an infinite loop.
    return 2 < arg.length;
  }

  return arg[Symbol.iterator];
};

const defaultOptions = {
  stringIgnore: true,
  circularReferenceToJson: false,
};

/**
 * Flatten iterable object
 * @param arg - The iterable object to flatten
 * @param options - options
 * @returns - Completely Flattened array
 */
export const flatDeep = <T = any>(iterable: Iterable<any>, options: FlatDeep.options = defaultOptions): T[] => {
  const circularReferenceObjects: any[] = [iterable];
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
      if (isFlatable(current, options.stringIgnore ?? true)) {
        if (typeof current === 'object') {
          if (!circularReferenceObjects.includes(current)) {
            circularReferenceObjects.push(current);

            return acc.concat(loop([...current]));
          }

          if (options.circularReferenceToJson) {
            return acc.concat(loop([...JSON.parse(safeStringify(current))]));
          }

          return acc.concat(current);
        }

        if (current !== '[Circular]') {
          return acc.concat(loop([...current]));
        }
      }

      return acc.concat(current);
    };

    return items.reduce(callback, []);
  };

  return loop([...iterable]);
};
