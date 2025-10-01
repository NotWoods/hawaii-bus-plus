import { registerPromiseWorker } from '../../worker/register.ts';

registerPromiseWorker(() => Promise.reject(new Error('oh noes')));
