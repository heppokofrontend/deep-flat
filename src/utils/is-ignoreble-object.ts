import { isFlatable } from './is-flatable';

export const isIgnorableObject = ({
  circularReferenceToJson = false,
  current,
  isWatched = false,
}: {
  /** If a circular reference is found, convert it to JSON without ignoring it */
  circularReferenceToJson: boolean;
  /** The current object of callback function in Array.reduce */
  current: unknown;
  /** Whether there is a suspicion of circulatory reference */
  isWatched: boolean;
}) =>
  typeof current !== 'string' && ((isWatched && !circularReferenceToJson) || !isFlatable(current));
