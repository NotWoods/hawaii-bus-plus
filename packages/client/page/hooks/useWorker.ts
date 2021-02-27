import { PromiseWorker } from '@hawaii-bus-plus/promise-worker';
import { useCallback, useEffect, useRef } from 'preact/hooks';

export interface WorkerConstructor {
  new (): Worker;
}

/**
 * Set up a worker that lasts as long as the component is mounted.
 * The worker is terminated afterwards.
 *
 * Returns a postMessage function.
 */
export function useWorker(workerConstructor: WorkerConstructor) {
  const workerRef = useRef<PromiseWorker | undefined>();

  const generateWorker = useCallback(() => {
    return new PromiseWorker(new workerConstructor());
  }, [workerConstructor]);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  async function postMessage(
    signal: AbortSignal,
    message: unknown
  ): Promise<unknown> {
    if (!workerRef.current) {
      workerRef.current = generateWorker();
    }

    console.info('WorkerRequest:', message);
    const result = await workerRef.current.postMessage(message, signal);
    console.info('WorkerResponse:', result);
    return result;
  }

  return postMessage;
}
