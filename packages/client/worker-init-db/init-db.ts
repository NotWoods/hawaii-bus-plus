import {
  dbReady,
  init,
  UnauthorizedError,
  PaymentRequiredError,
} from '@hawaii-bus-plus/data';
import { registerPromiseWorker } from '@hawaii-bus-plus/promise-worker/worker';

const apiReady = dbReady.then((db) => (db ? init(db) : undefined));

registerPromiseWorker(async () => {
  try {
    await apiReady;
  } catch (err: unknown) {
    if (
      err instanceof UnauthorizedError ||
      err instanceof PaymentRequiredError
    ) {
      throw err.code;
    } else {
      return err;
    }
  }
});
