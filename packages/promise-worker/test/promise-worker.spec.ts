import { expect, test, vi } from 'vitest';
import { PromiseWorker } from '../page/promise-worker.js';

test('calls terminate', () => {
  const worker = {
    terminate: vi.fn(),
    addEventListener() {},
  } satisfies Partial<Worker>;
  const promiseWorker = new PromiseWorker(worker as unknown as Worker);

  expect(worker.terminate).not.toHaveBeenCalled();
  promiseWorker.terminate();
  expect(worker.terminate).toHaveBeenCalledTimes(1);
});
