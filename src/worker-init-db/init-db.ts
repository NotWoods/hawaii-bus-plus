import { init } from '../data/db-repository/init';
import { dbReady } from '../data/database';
import { registerPromiseWorker } from '../worker-base/register';

const apiReady = dbReady.then(init);

registerPromiseWorker(() => apiReady);
