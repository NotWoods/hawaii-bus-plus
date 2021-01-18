import { initDatabase } from '../data/database';
import { downloadScheduleData } from '../data/fetch';
import { registerPromiseWorker } from '../worker-base/register';

const apiReady = downloadScheduleData().then(initDatabase);

registerPromiseWorker(() => apiReady);
