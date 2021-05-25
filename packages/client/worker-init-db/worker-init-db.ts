import { IDB_SUPPORT, init, openDatabase } from '@hawaii-bus-plus/data';
import { registerPromiseWorker } from '@hawaii-bus-plus/promise-worker/worker';

let apiReady: Promise<void> | undefined;
if (IDB_SUPPORT) {
  apiReady = openDatabase().then(init);
}

registerPromiseWorker(() => apiReady);
