import { Repository } from '@hawaii-bus-plus/data';
import { Stop } from '@hawaii-bus-plus/types';

export interface StopDetails extends Omit<Stop, 'transfers'> {
  transfers: readonly {
    toStop: Stop;
    transfer_type: 0 | 1 | 2 | 3;
    min_transfer_time?: number;
  }[];
}

export function loadStop(
  repo: Pick<Repository, 'loadStops'>,
  stopId: Stop['stop_id']
): Promise<StopDetails | undefined> {
  return repo
    .loadStops([stopId])
    .then((stops) => stops.get(stopId))
    .then((stop) => {
      if (!stop) return undefined;

      return repo
        .loadStops(stop.transfers.map((t) => t.from_stop_id))
        .then((stops) =>
          stop.transfers.map((t) => ({
            toStop: stops.get(t.to_stop_id)!,
            transfer_type: t.transfer_type,
            min_transfer_time: t.min_transfer_time,
          }))
        )
        .then((transfers) => ({
          ...stop,
          transfers,
        }));
    });
}
