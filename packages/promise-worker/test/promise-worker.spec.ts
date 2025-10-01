import { expect, test, vi } from 'vitest';
import { PromiseWorker } from '../page/promise-worker.ts';

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
