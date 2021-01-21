import { registerPromiseWorker } from '../../worker/register.js';

registerPromiseWorker(function () {
  return Promise.reject(new Error('oh noes'));
});
