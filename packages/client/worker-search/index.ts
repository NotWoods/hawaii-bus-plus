import { makeRepository } from '@hawaii-bus-plus/data';
import { registerPromiseWorker } from '@hawaii-bus-plus/promise-worker/worker';
import { SearchRequest } from './helpers';
import { search } from './search';

const repo = makeRepository();

registerPromiseWorker((message: SearchRequest) => search(repo, message));
