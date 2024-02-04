export function compareAs<T>(fn: (item: T) => number) {
  return (a: T, b: T) => fn(a) - fn(b);
}

/**
 * Type guard for a non-null value in a map entry.
 */
export function valueNotNull<K, V>(
  entry: readonly [K, V],
): entry is readonly [K, NonNullable<V>] {
  return entry[1] != undefined;
}

/**
 * Search the array back to front for an item that satisfies the predicate.
 * Returns the index of the item, or -1 if no item is found.
 * Polyfill for `Array.prototype.findLastIndex`.
 */
export function findLastIndex<T>(
  array: readonly T[],
  predicate: (item: T) => boolean,
  fromIndex: number = lastIndex(array),
) {
  for (let i = fromIndex; i >= 0; i--) {
    if (predicate(array[i])) {
      return i;
    }
  }
  return -1;
}

function lastIndex(list: readonly unknown[]) {
  return list.length - 1;
}

/**
 * Returns the last item in an array. Equivalent to `list.at(-1)`.
 */
export function last<T>(list: readonly T[]) {
  return list[lastIndex(list)];
}
