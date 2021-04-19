import { PromiseWorker } from '@hawaii-bus-plus/promise-worker';
import { useCallback, useEffect, useRef } from 'preact/hooks';

export interface WorkerConstructor {
  new (): Worker;
}

function debugLog(type: 'req' | 'res', data: unknown) {
  if (import.meta.env.DEV) {
    const styles = [
      `background: #${type === 'req' ? '3498db' : '2ecc71'}`,
      `border-radius: 0.5em`,
      `color: white`,
      `font-weight: bold`,
      `padding: 2px 0.5em`,
    ];

    console.log(`%cworker-${type}`, styles.join(';'), '\n', data);
  }
}

/**
 * Set up a worker that lasts as long as the component is mounted.
 * The worker is terminated afterwards.
 *
 * Returns a postMessage function.
 */
export function useWorker(workerConstructor: WorkerConstructor) {
  const workerRef = useRef<PromiseWorker | Error | undefined>();

  const generateWorker = useCallback(() => {
    try {
      return new PromiseWorker(new workerConstructor());
    } catch (err: unknown) {
      if (err instanceof Error) {
        (err as { code?: unknown }).code = 'worker_start_error';
        return err;
      } else {
        throw err;
      }
    }
  }, [workerConstructor]);

  useEffect(() => {
    return () => {
      const worker = workerRef.current;
      if (worker instanceof PromiseWorker) {
        worker.terminate();
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

    debugLog('req', message);
    const worker = workerRef.current;
    if (worker instanceof PromiseWorker) {
      const result = await worker.postMessage(message, signal);
      debugLog('res', result);
      return result;
    } else {
      throw worker;
    }
  }

  return postMessage;
}
