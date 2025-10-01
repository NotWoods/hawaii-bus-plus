import { registerPromiseWorker } from '../../worker/register.ts';

registerPromiseWorker(() => {
  throw new Error('busted!');
});
