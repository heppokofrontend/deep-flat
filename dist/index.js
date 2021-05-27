"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatDeep = void 0;
const fast_safe_stringify_1 = require("fast-safe-stringify");
;
/**
 * Determine if flatable
 * @param arg - Variables to be checked
 * @returns - Judgment result
 */
const isFlatable = (arg) => {
    if (!arg) {
        return false;
    }
    return arg[Symbol.iterator];
};
/** The default option config of flatDeep */
const defaultOptions = {
    stringIgnore: true,
    circularReferenceToJson: false,
};
/**
 * Check if it's an ignorable string
 * @param options - The option of flatDeep
 * @param current - The current object of callback function in Array.reduce
 * @returns - Judgment result
 */
const isIgnorableString = (options, current) => (typeof current === 'string' &&
    (((options.stringIgnore ?? true) ||
        current.length < 2) ||
        current === '[Circular]'));
/**
 * Check if it's an ignorable object
 * @param options - The option of flatDeep
 * @param current - The current object of callback function in Array.reduce
 * @param isWatched - Whether there is a suspicion of circulatory reference
 * @returns - Judgment result
 */
const isIgnorableObject = (options, current, isWatched) => (typeof current !== 'string' &&
    ((isWatched &&
        !options.circularReferenceToJson) ||
        !isFlatable(current)));
/**
 * Flatten iterable object
 * @param argIterableObj - The iterable object to flatten
 * @param options - options
 * @returns - Completely Flattened array
 */
const flatDeep = (argIterableObj, options = defaultOptions) => {
    /**
     * In order to avoid circular references, the object once checked by
     * the flatDeep (loop) function should be ignored.
     * This Set object is used to manage the confirmed objects.
     */
    const duplicateObjects = new Set([argIterableObj]);
    /**
     * The functions that are recursively called continuously
     * @param items - The iterable object to flatten
     * @returns - A completely flattened array
     */
    const loop = (items) => {
        /**
         * The callback function of Array.prototype.reduce
         * @param acc - The accumulator accumulates callbackFn's return values
         * @param current - The current element being processed in the array
         * @returns - A flattened array
         */
        const callback = (acc, current) => {
            const isWatched = duplicateObjects.has(current);
            if (isIgnorableString(options, current) ||
                isIgnorableObject(options, current, isWatched)) {
                return acc.concat(current);
            }
            if (typeof current === 'object') {
                duplicateObjects.add(current);
                if (isWatched &&
                    options.circularReferenceToJson) {
                    return acc.concat(loop([...JSON.parse(fast_safe_stringify_1.default(current))]));
                }
            }
            return acc.concat(loop([...current]));
        };
        return items.reduce(callback, []);
    };
    if (!argIterableObj[Symbol.iterator]) {
        throw new TypeError('The argument is not iterable');
    }
    return loop([...argIterableObj]);
};
exports.flatDeep = flatDeep;
