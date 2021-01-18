import { registerPromiseWorker } from '../worker-base/register';
import { AutocompletionRequest } from './places-autocomplete';
import { search } from './search';

registerPromiseWorker((message: AutocompletionRequest) => search(message));
