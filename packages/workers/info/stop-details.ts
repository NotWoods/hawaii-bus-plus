import { getSingle, type Repository } from '@hawaii-bus-plus/data';
import type { Agency, Route, Stop } from '@hawaii-bus-plus/types';

export interface StopDetails extends Omit<Stop, 'routes' | 'transfers'> {
  routes: ReadonlyMap<Route['route_id'], Route>;
  agencies: ReadonlyMap<Agency['agency_id'], Agency>;
  transfers: readonly {
    toStop: Stop;
    transfer_type: 0 | 1 | 2 | 3;
    min_transfer_time?: number;
  }[];
}

export async function loadStop(
  repo: Pick<Repository, 'loadStops' | 'loadRoutes' | 'loadAgencies'>,
  stopId: Stop['stop_id'],
): Promise<StopDetails | undefined> {
  const stop = await getSingle(repo, repo.loadStops, stopId);
  if (!stop) return undefined;

  const transferStops = await repo.loadStops(
    stop.transfers.map((t) => t.to_stop_id),
  );
  const routeIds = Array.from(transferStops.values())
    .flatMap((stop) => stop.routes)
    .concat(stop.routes);
  const routes = await repo.loadRoutes(routeIds);
  const agencyIds = Array.from(routes.values(), (route) => route.agency_id);
  const agencies = await repo.loadAgencies(agencyIds);

  const transfers = stop.transfers.map((t) => ({
    toStop: transferStops.get(t.to_stop_id)!,
    transfer_type: t.transfer_type,
    min_transfer_time: t.min_transfer_time,
  }));

  return {
    ...stop,
    routes,
    agencies,
    transfers,
  };
}
