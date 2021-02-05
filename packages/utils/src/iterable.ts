/**
 * Calls a defined callback function on each element of an iterable,
 * and returns an iterable that contains the results.
 */
export function* map<In, Out>(
  source: Iterable<In>,
  mapper: (item: In) => Out
): IterableIterator<Out> {
  for (const item of source) {
    yield mapper(item);
  }
}

/**
 * Returns the elements of an iterable that meet the condition specified in a callback function.
 */
export function filter<In, Out extends In>(
  source: Iterable<In>,
  predicate: (item: In) => item is Out
): IterableIterator<Out>;
export function filter<In>(
  source: Iterable<In>,
  predicate: (item: In) => boolean
): IterableIterator<In>;
export function* filter<In>(
  source: Iterable<In>,
  predicate: (item: In) => boolean
) {
  for (const item of source) {
    if (predicate(item)) {
      yield item;
    }
  }
}

export function* take<In>(source: Iterable<In>, limit: number) {
  let remaining = limit;
  for (const item of source) {
    if (remaining <= 0) {
      return;
    }
    yield item;
    remaining--;
  }
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

/**
 * Calls a defined callback function on each element of an array.
 * Then, flattens the result into a new array.
 * This is identical to a map followed by flat with depth 1.
 */
export function* flatMap<In, Out>(
  source: Iterable<In>,
  mapper: (item: In) => Iterable<Out>
): IterableIterator<Out> {
  for (const item of source) {
    for (const subItem of mapper(item)) {
      yield subItem;
    }
  }
}
