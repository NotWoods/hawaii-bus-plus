import { Temporal } from 'proposal-temporal/lib/index.mjs';
import { Route } from '../shared/gtfs-types';
import { gtfsArrivalToDate } from '../shared/utils/temporal';
import { findClosestStops } from './closest-stops';

export async function directionsTo(
  from: google.maps.LatLngLiteral,
  to: google.maps.LatLngLiteral,
  departTime: Temporal.PlainDateTime
) {
  const [depart, arrive] = await Promise.all([
    findClosestStops(from),
    findClosestStops(to),
  ]);

  /** Route ID to priority */
  const arriveRoutes = new Map<Route['route_id'], number>();
  for (const [i, stop] of arrive.entries()) {
    for (const routeId of stop.routes) {
      if (!arriveRoutes.has(routeId)) {
        arriveRoutes.set(routeId, i);
      }
    }
  }

  const departPlainTime = departTime.toPlainTime();
  for (const stop of depart) {
    for (const trip of stop.trips) {
      const { time } = gtfsArrivalToDate(trip.time);
      // If departure time is before trip time
      if (Temporal.PlainTime.compare(departPlainTime, time) < 1) {
      }
    }
  }
}
