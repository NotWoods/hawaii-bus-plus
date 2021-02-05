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

export function lastIndex(list: readonly unknown[]) {
  return list.length - 1;
}
