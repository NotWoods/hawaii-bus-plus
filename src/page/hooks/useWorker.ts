import { useEffect, useRef } from 'react';
import { PromiseWorker } from '../../shared/promise-worker';

/**
 * Set up a worker that lasts as long as the component is mounted.
 * The worker is terminated afterwards.
 */
export function useWorker(workerConstructor: { new (): Worker }) {
  const workerRef = useRef<PromiseWorker | undefined>();

  useEffect(() => {
    const worker = new PromiseWorker(new workerConstructor());
    workerRef.current = worker;

    return () => {
      worker.terminate();
      workerRef.current = undefined;
    };
  }, []);

  return workerRef.current;
}
