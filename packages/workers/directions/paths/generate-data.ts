import type { Repository } from '@hawaii-bus-plus/data';
import '@hawaii-bus-plus/polyfills/getorinsert';
import { serviceRunningOn } from '@hawaii-bus-plus/temporal-utils';
import type {
  DirectionRoute,
  DirectionRouteMutable,
  DirectionsData,
  DirectionStop,
  Stop,
  Trip,
} from '@hawaii-bus-plus/types';
import { Temporal } from '@js-temporal/polyfill';

/**
 * In RAPTOR, routes are distinct if they go in different directions or have different stops.
 * Different route IDs are generated for use with the algorithm,
 * independent of normal GTFS route IDs.
 */
export function uniqueRouteId(trip: Trip): DirectionRoute['id'] {
  return trip.stop_times
    .map((st) => st.stop_id)
    .join(',') as DirectionRoute['id'];
}

const defaultRoute = (id: DirectionRoute['id']): DirectionRouteMutable => ({
  id,
  trips: [],
  stops: new Set(),
});
const defaultStop = (id: Stop['stop_id']): DirectionStop => ({
  id,
  routes: [],
});

export async function generateDirectionsData(
  repo: Pick<Repository, 'loadCalendars' | 'loadTrips'>,
  date: Temporal.PlainDate,
): Promise<DirectionsData> {
  const allCalendars = await repo.loadCalendars();

  const routes = new Map<DirectionRoute['id'], DirectionRouteMutable>();
  const stops = new Map<Stop['stop_id'], DirectionStop>();

  let cursor = await repo.loadTrips();
  while (cursor) {
    const trip = cursor.value;

    if (serviceRunningOn(allCalendars, trip.service_id, date)) {
      const routeId = uniqueRouteId(trip);
      const route = routes.getOrInsert(routeId, defaultRoute(routeId));
      route.trips.push(trip);

      for (const stopTime of trip.stop_times) {
        const stop = stops.getOrInsert(
          stopTime.stop_id,
          defaultStop(stopTime.stop_id),
        );
        if (
          !stop.routes.find(
            (r) =>
              r.route_id === routeId && r.sequence === stopTime.stop_sequence,
          )
        ) {
          stop.routes.push({
            route_id: routeId,
            sequence: stopTime.stop_sequence,
          });
        }
        route.stops.add(stop.id);
      }
    }

    cursor = await cursor.continue();
  }

  return {
    routes: Object.fromEntries(routes),
    stops: Object.fromEntries(stops),
  };
}
