import { registerPromiseWorker } from '../../worker/register.js';

registerPromiseWorker(() => Promise.resolve('pong'));
