import { dbReady, UnauthorizedError } from '@hawaii-bus-plus/data';
import { PromiseWorker } from '@hawaii-bus-plus/promise-worker';
import { useEffect, useState } from 'preact/hooks';
import InitDBWorker from '../../worker-init-db/init-db?worker';

const initWorker = new PromiseWorker(new InitDBWorker());

function unauthorizedError(err: unknown): err is UnauthorizedError {
  return (err as UnauthorizedError).code === 401;
}

/**
 * Resolves once the database has been set up.
 */
export const databaseInitialized = initWorker
  .postMessage(localStorage.getItem('api-key'))
  .catch((err: unknown) => {
    if (unauthorizedError(err)) {
      // Unauthorized, delete bad API key
      localStorage.removeItem('api-key');
    } else {
      console.error(err);
    }
  })
  .then(() => {
    initWorker.terminate();
  });

export function useDatabaseInitialized() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    databaseInitialized.then(
      () => setInitialized(true),
      () => setInitialized(false)
    );
  }, []);

  return initialized;
}

declare global {
  interface Window {
    databaseInitialized: typeof dbReady;
  }
}

window.databaseInitialized = databaseInitialized.then(() => dbReady);
