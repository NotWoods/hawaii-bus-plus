import { Repository } from '@hawaii-bus-plus/data';
import { Route, Stop } from '@hawaii-bus-plus/types';

export interface StopDetails extends Omit<Stop, 'routes' | 'transfers'> {
  routes: readonly Route[];
  transfers: readonly {
    toStop: Stop;
    transfer_type: 0 | 1 | 2 | 3;
    min_transfer_time?: number;
  }[];
}

export async function loadStop(
  repo: Pick<Repository, 'loadStops' | 'loadRoutes'>,
  stopId: Stop['stop_id']
): Promise<StopDetails | undefined> {
  const stop = (await repo.loadStops([stopId])).get(stopId);
  if (!stop) return undefined;

  const [transferStops, routes] = await Promise.all([
    repo.loadStops(stop.transfers.map((t) => t.from_stop_id)),
    repo.loadRoutes(stop.routes),
  ]);
  const transfers = stop.transfers.map((t) => ({
    toStop: transferStops.get(t.to_stop_id)!,
    transfer_type: t.transfer_type,
    min_transfer_time: t.min_transfer_time,
  }));

  return {
    ...stop,
    routes: Array.from(routes.values()),
    transfers,
  };
}
