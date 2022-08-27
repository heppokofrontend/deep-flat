import safeStringify from 'fast-safe-stringify';
import { isIgnorableObject } from './utils/is-ignoreble-object';
import { isIgnorableString } from './utils/is-ignoreble-string';

/**
 * Flatten iterable object
 * @param argIterableObj - The iterable object to flatten
 * @param options - options
 * @returns - Completely Flattened array
 */
export const flatDeep = <T = any>(
  argIterableObj: Iterable<any>,
  option?: {
    stringIgnore?: boolean;
    circularReferenceToJson?: boolean;
  },
): T[] => {
  const { stringIgnore = true, circularReferenceToJson = false } = option || {};
  /**
   * In order to avoid circular references, the object once checked by
   * the flatDeep (loop) function should be ignored.
   * This Set object is used to manage the confirmed objects.
   */
  const duplicateObjects = new Set<unknown>([argIterableObj]);
  /**
   * The functions that are recursively called continuously
   * @param items - The iterable object to flatten
   * @returns - A completely flattened array
   */
  const loop = (items: unknown[]): T[] => {
    return items.reduce((accumulator: any[], current: any) => {
      const isWatched = duplicateObjects.has(current);

      if (
        isIgnorableString({
          stringIgnore,
          current,
        }) ||
        isIgnorableObject({ circularReferenceToJson, current, isWatched })
      ) {
        return accumulator.concat(current);
      }

      if (typeof current === 'object') {
        duplicateObjects.add(current);

        if (isWatched && circularReferenceToJson) {
          return accumulator.concat(loop([...JSON.parse(safeStringify(current))]));
        }
      }

      return accumulator.concat(loop([...current]));
    }, []);
  };

  return loop([...argIterableObj]);
};
