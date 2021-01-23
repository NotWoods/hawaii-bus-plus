import { Repository } from '@hawaii-bus-plus/data';
import {
  DirectionRoute,
  DirectionsData,
  DirectionStop,
  Stop,
} from '@hawaii-bus-plus/types';
import { serviceRunningOn } from '@hawaii-bus-plus/utils';
import { DefaultMap } from 'mnemonist';
import { Temporal } from 'proposal-temporal';
import { uniqueRouteId } from './route-queue';

export async function generateDirectionsData(
  repo: Pick<Repository, 'loadCalendars' | 'loadTrips'>,
  date: Temporal.PlainDate
): Promise<DirectionsData> {
  const allCalendars = await repo.loadCalendars();

  const routes = new DefaultMap<DirectionRoute['id'], DirectionRoute>((id) => ({
    id,
    trips: [],
    stops: new Set(),
  }));
  const stops = new DefaultMap<Stop['stop_id'], DirectionStop>((id) => ({
    id,
    routes: [],
  }));

  let cursor = await repo.loadTrips();
  while (cursor) {
    const trip = cursor.value;

    if (serviceRunningOn(allCalendars, trip.service_id, date)) {
      const routeId = uniqueRouteId(trip);
      const route = routes.get(routeId);
      route.trips.push(trip);

      for (const stopTime of trip.stop_times) {
        const stop = stops.get(stopTime.stop_id);
        stop.routes.push({
          route_id: routeId,
          sequence: stopTime.stop_sequence,
        });
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