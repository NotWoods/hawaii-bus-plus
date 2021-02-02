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

  const generateWorker = useCallback(() => {
    return new PromiseWorker(new workerConstructor());
  }, [workerConstructor]);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  async function postMessage(message: unknown): Promise<unknown> {
    if (!workerRef.current) {
      workerRef.current = generateWorker();
    }

    console.log('WorkerRequest', message);
    const result = await workerRef.current.postMessage(message);
    console.log('WorkerResponse', result);
    return result;
  }

  return postMessage;
}
