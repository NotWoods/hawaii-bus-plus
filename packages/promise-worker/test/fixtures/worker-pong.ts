import { registerPromiseWorker } from '../../worker/register.js';

registerPromiseWorker(function () {
  return 'pong';
});
