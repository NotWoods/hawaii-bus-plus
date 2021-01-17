import { initDatabase } from '../data/database';
import { downloadScheduleData } from '../data/fetch';
import { registerPromiseWorker } from '../worker-base/register';
import { AutocompletionRequest } from './places-autocomplete';
import { search } from './search';

downloadScheduleData().then((api) => {
  return initDatabase(api);
});

registerPromiseWorker(async (message: AutocompletionRequest) => {
  return search(message);
});
