import { downloadScheduleData } from '../data/fetch';
import { registerPromiseWorker } from '../worker-base/register';
import { fuseRoutes, fuseStops } from './gtfs-search';
import { AutocompletionRequest } from './places-autocomplete';
import { search } from './search';

downloadScheduleData().then((api) => {
  fuseRoutes.initialize(Object.values(api.routes));
  fuseStops.initialize(Object.values(api.stops));
});

registerPromiseWorker(async (message: AutocompletionRequest) => {
  return search(message);
});
