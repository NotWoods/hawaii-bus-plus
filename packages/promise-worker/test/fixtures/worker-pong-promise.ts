import { registerPromiseWorker } from '../../worker/register.ts';

registerPromiseWorker(() => Promise.resolve('pong'));
