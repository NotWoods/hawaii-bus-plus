export function compareAs<T>(fn: (item: T) => number) {
  return (a: T, b: T) => fn(a) - fn(b);
}

export function nestedNotNull<T extends object, K extends keyof T>(key: K) {
  return (item: T): item is T & { [P in K]: NonNullable<T[P]> } =>
    item[key] != undefined;
}

export function valueNotNull<K, V>(
  entry: readonly [K, V]
): entry is readonly [K, NonNullable<V>] {
  return entry[1] != undefined;
}

export function* skipUntil<T>(list: Iterable<T>, cb: (item: T) => boolean) {
  let found = false;
  for (const item of list) {
    found ||= cb(item);
    if (found) {
      yield item;
    }
  }
}
