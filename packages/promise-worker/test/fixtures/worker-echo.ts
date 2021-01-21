import { registerPromiseWorker } from '../../worker/register.js';

registerPromiseWorker(function (msg) {
  return msg;
});
