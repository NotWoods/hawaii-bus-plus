import { registerPromiseWorker } from '../../worker/register.ts';

registerPromiseWorker(() => 'pong');
