import { valueNotNull } from './sort.js';

/**
 * Run `cb` on all values in `input`.
 * Returns a map of input item -> output item, which undefined items skipped.
 */
export function batch<In, Out>(
  input: Iterable<In>,
  cb: (
    item: In,
  ) => Out | null | undefined | PromiseLike<Out | null | undefined>,
) {
  return Promise.all(
    Array.from(input, async (item) => [item, await cb(item)] as const),
  )
    .then((output) => output.filter(valueNotNull))
    .then((output) => new Map(output));
}
