"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatDeep = exports.isFlatable = void 0;
const fast_safe_stringify_1 = require("fast-safe-stringify");
;
/**
 * Determine if flatable.
 * @param arg - Variables to be checked
 * @param isStringIgnore - Whether to ignore the string type
 * @returns - Judgment result
 */
const isFlatable = (arg, isStringIgnore) => {
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
exports.isFlatable = isFlatable;
/**
 * Flatten iterable object
 * @param arg - The iterable object to flatten
 * @param options - options
 * @returns - Completely Flattened array
 */
const flatDeep = (iterable, options = {
    stringIgnore: true,
    circularReferenceToJson: false,
}) => {
    const hoge = [iterable];
    /**
     * @param items - The iterable object to flatten
     * @returns - A completely flattened array.
     */
    const loop = (items) => {
        /**
         * The callback function of Array.prototype.reduce
         * @param acc - The accumulator accumulates callbackFn's return values.
         * @param current - The current element being processed in the array.
         * @returns - A flattened array.
         */
        const callback = (acc, current) => {
            if (exports.isFlatable(current, options.stringIgnore ?? true)) {
                if (typeof current === 'object') {
                    if (!hoge.includes(current)) {
                        hoge.push(current);
                        return acc.concat(loop([...current]));
                    }
                    if (options.circularReferenceToJson) {
                        return acc.concat(loop([...JSON.parse(fast_safe_stringify_1.default(current))]));
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
exports.flatDeep = flatDeep;
