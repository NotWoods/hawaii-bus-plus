import { PromiseWorker } from '@hawaii-bus-plus/promise-worker';
import { useCallback, useEffect, useRef } from 'preact/hooks';
import type { InfoWorkerHandler } from '../../worker-info/info';
import InfoWorker from '../../worker-info/info?worker';
import { WorkerConstructor } from './useWorker';

interface WorkerEntry {
  worker: PromiseWorker;
  refs: number;
}

const workers = new WeakMap<WorkerConstructor, WorkerEntry>();

/**
 * Set up a worker that lasts as long as the component is mounted.
 * The worker is terminated afterwards.
 *
 * Returns a postMessage function.
 */
export function useSharedWorker(workerConstructor: { new (): Worker }) {
  const workerRef = useRef<WorkerEntry | undefined>();

  const generateWorker = useCallback(() => {
    if (workers.has(workerConstructor)) {
      const entry = workers.get(workerConstructor)!;
      entry.refs++;
      return entry;
    } else {
      console.log('Open shared worker');
      const worker = new PromiseWorker(new workerConstructor());
      const entry = { worker, refs: 1 };
      workers.set(workerConstructor, entry);
      return entry;
    }
  }, [workerConstructor]);

  useEffect(() => {
    return () => {
      const entry = workerRef.current;
      if (entry) {
        entry.refs--;
        if (entry.refs <= 0) {
          console.log('Close shared worker');
          entry.worker.terminate();
        }
      }
    };
  }, []);

  async function postMessage(
    signal: AbortSignal,
    message: unknown,
  ): Promise<unknown> {
    if (!workerRef.current) {
      workerRef.current = generateWorker();
    }

    console.info('Shared WorkerRequest:', message);
    const result = await workerRef.current.worker.postMessage(message, signal);
    console.info('Shared WorkerResponse:', result);
    return result;
  }

  return postMessage;
}

export function useSharedInfoWorker() {
  const postMessage = useSharedWorker(InfoWorker) as InfoWorkerHandler;
  return postMessage;
}
