import { dbReady, init } from '@hawaii-bus-plus/data';
import { registerPromiseWorker } from '@hawaii-bus-plus/promise-worker/worker';
import { memoize } from '@hawaii-bus-plus/utils';

const apiReady = memoize((apiKey: string) =>
  dbReady.then((db) => init(apiKey, db))
);

registerPromiseWorker(apiReady);
