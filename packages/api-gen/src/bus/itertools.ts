export async function arrayFromAsync<T>(iterable: AsyncIterable<T>) {
  const result: T[] = [];
  for await (const item of iterable) {
    result.push(item);
  }
  return result;
}

export function zip<A, B>(
  a: Iterable<A>,
  b: Iterable<B>,
): IterableIterator<[A, B]>;
export function* zip(
  ...iterables: Iterable<unknown>[]
): IterableIterator<unknown[]> {
  const iterators = iterables.map((iterable) => iterable[Symbol.iterator]());
  while (true) {
    const results = iterators.map((iterator) => iterator.next());
    if (results.some((result) => result.done)) {
      break;
    }
    yield results.map((result) => result.value);
  }
}
