import { Repository } from '../data/repository';
import { Stop } from '../shared/gtfs-types';

export function loadStop(
  repo: Pick<Repository, 'loadStops'>,
  stopId: Stop['stop_id']
) {
  return repo.loadStops([stopId]).then((stops) => stops.get(stopId));
}
