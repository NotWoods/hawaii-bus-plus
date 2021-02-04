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

export function* skipUntil<T>(list: Iterable<T>, cb: (item: T) => boolean) {
  let found = false;
  for (const item of list) {
    found = found || cb(item);
    if (found) {
      yield item;
    }
  }
}

export function lastIndex(list: readonly unknown[]) {
  return list.length - 1;
}
