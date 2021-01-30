import { makeRepository } from '@hawaii-bus-plus/data';
import { registerPromiseWorker } from '@hawaii-bus-plus/promise-worker/worker';
import { SearchRequest } from './helpers';
import { search, SearchResults } from './search';

const repo = makeRepository();

export interface SearchWorkerHandler {
  (message: SearchRequest): Promise<SearchResults>;
}

registerPromiseWorker((message: SearchRequest) => search(repo, message));
