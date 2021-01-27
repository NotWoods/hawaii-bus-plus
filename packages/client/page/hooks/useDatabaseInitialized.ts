import { PromiseWorker } from '@hawaii-bus-plus/promise-worker';
import { useEffect, useState } from 'react';
import InitDBWorker from '../../worker-init-db/init-db?worker';

const initWorker = new PromiseWorker(new InitDBWorker());

/**
 * Resolves once the database has been set up.
 */
export const databaseInitialized = initWorker
  .postMessage(undefined)
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
