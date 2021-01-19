import { PromiseWorker } from '../../shared/promise-worker';
import InitDBWorker from '../../worker-init-db/init-db?worker';

const initWorker = new PromiseWorker(new InitDBWorker());

/**
 * Resolves once the database has been set up.
 */
export const dbInitialized = initWorker.postMessage(undefined).then(() => {
  initWorker.terminate();
});
