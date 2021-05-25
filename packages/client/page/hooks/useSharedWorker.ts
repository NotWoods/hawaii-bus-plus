import { PromiseWorker } from '@hawaii-bus-plus/promise-worker';
import { useCallback } from 'preact/hooks';
import { WorkerConstructor } from './useWorker';

interface WorkerEntry {
  readonly worker: PromiseWorker;
  timeoutId: number;
}

const workers = new WeakMap<WorkerConstructor, WorkerEntry>();

const TIMEOUT = 10_000;

function terminateSharedWorker(workerConstructor: WorkerConstructor) {
  const entry = workers.get(workerConstructor);
  if (entry) {
    entry.worker.terminate();
    workers.delete(workerConstructor);
  }
}

function renewTimer(entry: WorkerEntry, workerConstructor: WorkerConstructor) {
  clearTimeout(entry.timeoutId);
  entry.timeoutId = setTimeout(
    terminateSharedWorker,
    TIMEOUT,
    workerConstructor,
  );
}

function getSharedWorker(workerConstructor: WorkerConstructor) {
  let entry = workers.get(workerConstructor);
  if (!entry) {
    const worker = new PromiseWorker(new workerConstructor());
    entry = { worker, timeoutId: -1 };
    workers.set(workerConstructor, entry);
  }

  renewTimer(entry, workerConstructor);
  return entry.worker;
}

/**
 * Set up a worker that lasts for about 10 seconds and will be shared across components.
 *
 * Returns a postMessage function.
 */
export function useSharedWorker(workerConstructor: WorkerConstructor) {
  const postMessage = useCallback(
    async (signal: AbortSignal, message?: unknown): Promise<unknown> => {
      const worker = getSharedWorker(workerConstructor);

      console.info('Shared WorkerRequest:', message);
      const result = await worker.postMessage(message, signal);
      console.info('Shared WorkerResponse:', result);
      return result;
    },
    [workerConstructor],
  );

  return postMessage;
}
