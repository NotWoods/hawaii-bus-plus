import { Inputs, useEffect } from 'preact/hooks';
import { useAlerts } from '../page-wrapper/alert/StickyAlerts';

export function usePromise(
  effect: (signal: AbortSignal) => Promise<void>,
  deps?: Inputs
) {
  const toastAlert = useAlerts();

  useEffect(() => {
    const controller = new AbortController();
    effect(controller.signal).catch((err: unknown) => {
      toastAlert({
        title: 'Error',
        children: (err as Error).message || (err as string),
        alertType: 'alert-danger',
      });
    });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
