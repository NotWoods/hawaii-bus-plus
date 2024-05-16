import { AbortError } from '@hawaii-bus-plus/promise-worker';
import { useEffect, type Inputs } from 'preact/hooks';
import { useSnackbar } from '../snackbar/context';

export class Warning extends Error {}

export function useAbortEffect(
  effect: (signal: AbortSignal) => void | (() => void),
  deps?: Inputs,
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

export function errorMessage(err: unknown) {
  if (err instanceof Error) {
    return err.message;
  } else {
    console.warn(`Received error with unknown type `, err);
    return 'An error occurred';
  }
}

export function usePromise(
  effect: (signal: AbortSignal) => Promise<void>,
  deps?: Inputs,
) {
  const toastAlert = useSnackbar();

  useAbortEffect((signal) => {
    effect(signal).catch((err: unknown) => {
      if (
        err instanceof AbortError ||
        (err as { name?: unknown }).name === 'AbortError'
      ) {
        // Ignore abort errors
        return;
      }

      toastAlert({
        children: errorMessage(err),
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
