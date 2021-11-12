import test from 'ava';
import { PromiseWorker } from '../page/promise-worker.js';

test('calls terminate', (t) => {
  let called = false;
  const worker = {
    terminate() {
      called = true;
    },
    addEventListener() {},
  };
  const promiseWorker = new PromiseWorker(worker as unknown as Worker);

  t.is(called, false);
  promiseWorker.terminate();
  t.is(called, true);
});
