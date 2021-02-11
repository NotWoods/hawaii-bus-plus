import { Inputs, useEffect } from 'preact/hooks';
import { useAlerts } from '../page-wrapper/alert/StickyAlerts';

export class Warning extends Error {}

export function useAbortEffect(
  effect: (signal: AbortSignal) => void | (() => void),
  deps?: Inputs
) {
  useEffect(() => {
    const controller = new AbortController();
    const unregister = effect(controller.signal) as undefined | (() => void);
    return () => {
      unregister?.();
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function usePromise(
  effect: (signal: AbortSignal) => Promise<void>,
  deps?: Inputs
) {
  const toastAlert = useAlerts();

  useAbortEffect((signal) => {
    effect(signal).catch((err: unknown) => {
      let message: string;
      if (err instanceof Error) {
        message = err.message;
      } else {
        message = 'An error occurred';
        console.warn(`Received error with unknown type `, err);
      }
      toastAlert({
        title: 'Error',
        children: message,
        alertType: err instanceof Warning ? 'alert-secondary' : 'alert-danger',
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
