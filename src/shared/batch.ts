/**
 * Run `cb` on all values in `input`.
 * Returns a map of input item -> output item, which undefined items skipped.
 */
export function batch<In, Out>(
  input: readonly In[],
  cb: (item: In) => Out | null | undefined | PromiseLike<Out | null | undefined>
) {
  return Promise.all(input.map(async (item) => [item, cb(item)] as const))
    .then((output) =>
      output.filter((entry): entry is [In, Out] => entry[1] != null)
    )
    .then((output) => new Map(output));
}
