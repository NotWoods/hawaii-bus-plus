import { PromiseWorker } from '@hawaii-bus-plus/promise-worker';
import InitDBWorker from '../../worker-init-db/init-db?worker';

const initWorker = new PromiseWorker(new InitDBWorker());
export const dbInitialized = initWorker
  .postMessage('')
  .then(() => initWorker.terminate());
