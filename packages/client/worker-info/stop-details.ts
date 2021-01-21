import { Repository } from '@hawaii-bus-plus/data';
import { Stop } from '@hawaii-bus-plus/types';

export function loadStop(
  repo: Pick<Repository, 'loadStops'>,
  stopId: Stop['stop_id']
) {
  return repo.loadStops([stopId]).then((stops) => stops.get(stopId));
}
