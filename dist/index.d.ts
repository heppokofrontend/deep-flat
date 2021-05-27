export declare namespace FlatDeep {
    /** The option of FlatDeep. */
    type options = {
        /** Whether to ignore the string type */
        stringIgnore?: boolean;
        /** If a circular reference is found, convert it to JSON without ignoring it */
        circularReferenceToJson?: boolean;
    };
}
/**
 * Flatten iterable object
 * @param argIterableObj - The iterable object to flatten
 * @param options - options
 * @returns - Completely Flattened array
 */
export declare const flatDeep: <T = any>(argIterableObj: Iterable<any>, options?: FlatDeep.options) => T[];
