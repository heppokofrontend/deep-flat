export declare namespace FlatDeep {
    /** The option of FlatDeep */
    type options = {
        /** Whether to ignore the string type */
        stringIgnore?: boolean;
        /** If a circular reference is found, convert it to JSON without ignoring it. */
        circularReferenceToJson?: boolean;
    };
}
/**
 * Determine if flatable.
 * @param arg - Variables to be checked
 * @param isStringIgnore - Whether to ignore the string type
 * @returns - Judgment result
 */
export declare const isFlatable: (arg: any, isStringIgnore: boolean) => any;
/**
 * Flatten iterable object
 * @param arg - The iterable object to flatten
 * @param options - options
 * @returns - Completely Flattened array
 */
export declare const flatDeep: <T = any>(iterable: Iterable<any>, options?: FlatDeep.options) => T[];
