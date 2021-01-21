import { makeRepository } from '../data/repository';
import { registerPromiseWorker } from '../worker-base/register';
import { AutocompletionRequest } from './places-autocomplete';
import { search } from './search';

const repo = makeRepository();

registerPromiseWorker((message: AutocompletionRequest) =>
  search(repo, message)
);
