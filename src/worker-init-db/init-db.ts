import { initDatabase } from '../data/init';
import { downloadScheduleData } from '../data/fetch';
import { registerPromiseWorker } from '../worker-base/register';

const apiReady = downloadScheduleData().then(initDatabase);

registerPromiseWorker(() => apiReady);
