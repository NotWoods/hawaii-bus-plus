import { AbortError } from '@hawaii-bus-plus/promise-worker';
import { Inputs, useEffect } from 'preact/hooks';
import { useSnackbar } from '../snackbar/context';

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
  const toastAlert = useSnackbar();

  useAbortEffect((signal) => {
    effect(signal).catch((err: unknown) => {
      let message: string;
      if (err instanceof AbortError) {
        // Ignore abort errors
        return;
      } else if (err instanceof Error) {
        message = err.message;
      } else {
        message = 'An error occurred';
        console.warn(`Received error with unknown type `, err);
      }
      toastAlert({
        children: message,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
