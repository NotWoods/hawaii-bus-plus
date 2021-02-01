import { registerPromiseWorker } from '../../worker/register.js';

registerPromiseWorker(() => Promise.reject(new Error('oh noes')));
