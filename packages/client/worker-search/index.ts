import { makeRepository } from '@hawaii-bus-plus/data';
import { registerPromiseWorker } from '@hawaii-bus-plus/promise-worker/worker';
import { AutocompletionRequest } from './places-autocomplete';
import { search } from './search';

const repo = makeRepository();

registerPromiseWorker((message: AutocompletionRequest) =>
  search(repo, message)
);
