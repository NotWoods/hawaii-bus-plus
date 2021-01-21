import { registerPromiseWorker } from '../../worker/register.js';

registerPromiseWorker(function () {
  throw new Error('busted!');
});
