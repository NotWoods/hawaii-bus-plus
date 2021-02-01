import { registerPromiseWorker } from '../../worker/register.js';

registerPromiseWorker(() => {
  throw new Error('busted!');
});
