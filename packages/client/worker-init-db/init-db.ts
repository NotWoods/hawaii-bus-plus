import { dbReady, init } from '@hawaii-bus-plus/data';
import { registerPromiseWorker } from '@hawaii-bus-plus/promise-worker/worker';

const apiReady = dbReady.then(init);

registerPromiseWorker(() => apiReady);
