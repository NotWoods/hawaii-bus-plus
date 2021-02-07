export function compareAs<T>(fn: (item: T) => number) {
  return (a: T, b: T) => fn(a) - fn(b);
}

export function notNull<T>(item: T): item is NonNullable<T> {
  return item != undefined;
}

export function valueNotNull<K, V>(
  entry: readonly [K, V]
): entry is readonly [K, NonNullable<V>] {
  return entry[1] != undefined;
}

export function findLastIndex<T>(
  array: readonly T[],
  predicate: (item: T) => boolean,
  fromIndex: number = lastIndex(array)
) {
  for (let i = fromIndex; i >= 0; i--) {
    if (predicate(array[i])) {
      return i;
    }
  }
  return -1;
}

export function lastIndex(list: readonly unknown[]) {
  return list.length - 1;
}

export function last<T>(list: readonly T[]) {
  return list[lastIndex(list)];
}
