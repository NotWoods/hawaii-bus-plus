import { DependencyList, useEffect } from 'react';

export function usePromise(
  effect: (signal: AbortSignal) => Promise<void>,
  deps?: DependencyList
) {
  useEffect(() => {
    const controller = new AbortController();
    effect(controller.signal);

    return () => controller.abort();
  }, deps);
}
