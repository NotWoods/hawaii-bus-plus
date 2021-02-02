import { PromiseWorker } from '@hawaii-bus-plus/promise-worker';
import { useCallback, useEffect, useRef } from 'preact/hooks';

/**
 * Set up a worker that lasts as long as the component is mounted.
 * The worker is terminated afterwards.
 *
 * Returns a postMessage function.
 */
export function useWorker(workerConstructor: { new (): Worker }) {
  const workerRef = useRef<PromiseWorker | undefined>();

  const generateWorker = useCallback(
    () => new PromiseWorker(new workerConstructor()),
    [workerConstructor]
  );

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  function postMessage(message: unknown): Promise<unknown> {
    if (!workerRef.current) {
      workerRef.current = generateWorker();
    }

    return workerRef.current.postMessage(message);
  }

  return postMessage;
}
