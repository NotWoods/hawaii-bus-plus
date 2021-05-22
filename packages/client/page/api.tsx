import { PromiseWorker } from '@hawaii-bus-plus/promise-worker';
import InitDBWorker from '../worker-init-db/worker-init-db?worker';

declare global {
  interface ImportMetaEnv {
    SSR: boolean;
  }
}

let dbInitialized: Promise<void>;
if (import.meta.env.SSR) {
  dbInitialized = Promise.resolve();
} else {
  const initWorker = new PromiseWorker(new InitDBWorker());
  dbInitialized = initWorker.postMessage().then(() => initWorker.terminate());
}

export { dbInitialized };
