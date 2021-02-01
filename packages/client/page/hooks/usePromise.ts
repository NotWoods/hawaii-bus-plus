import { Inputs, useEffect } from 'preact/hooks';

export function usePromise(
  effect: (signal: AbortSignal) => Promise<void>,
  deps?: Inputs
) {
  useEffect(() => {
    const controller = new AbortController();
    effect(controller.signal);

    return () => controller.abort();
  }, deps);
}
