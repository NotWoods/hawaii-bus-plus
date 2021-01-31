import { dbReady } from '@hawaii-bus-plus/data';
import { PromiseWorker } from '@hawaii-bus-plus/promise-worker';
import { useEffect, useState } from 'react';
import InitDBWorker from '../../worker-init-db/init-db?worker';

const initWorker = new PromiseWorker(new InitDBWorker());

/**
 * Resolves once the database has been set up.
 */
export const databaseInitialized = initWorker
  .postMessage(localStorage.getItem('api-key'))
  .catch((err) => {
    if (err.code === 401) {
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
    databaseInitialized.then(() => setInitialized(true));
  }, []);
  return initialized;
}

(window as any).databaseInitialized = databaseInitialized.then(() => dbReady);
