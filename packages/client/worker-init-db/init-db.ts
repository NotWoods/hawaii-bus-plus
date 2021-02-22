import {
  dbReady,
  init,
  UnauthorizedError,
  PaymentRequiredError,
} from '@hawaii-bus-plus/data';
import { registerPromiseWorker } from '@hawaii-bus-plus/promise-worker/worker';

const apiReady = dbReady.then((db) => init(db));

registerPromiseWorker(async () => {
  try {
    await apiReady;
  } catch (err: unknown) {
    console.warn(err, (err as { code: number }).code);
    if (err instanceof UnauthorizedError) {
      throw 401;
    } else if (err instanceof PaymentRequiredError) {
      throw 402;
    } else {
      return err;
    }
  }
});
