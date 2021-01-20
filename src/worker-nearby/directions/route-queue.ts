import {
  DirectionRoute,
  DirectionsData,
  StopRouteInfo,
} from '../../shared/directions-types';
import { Stop, Trip } from '../../shared/gtfs-types';

/**
 * In RAPTOR, routes are distinct if they go in different directions or have different stops.
 * Different route IDs are generated for use with the algorithm,
 * independent of normal GTFS route IDs.
 */
export function uniqueRouteId(trip: Trip) {
  return trip.stop_times
    .map((st) => st.stop_id)
    .join(',') as DirectionRoute['id'];
}

/**
 * Construct queue Q for RAPTOR from the marked stops in the previous round.
 * Returns a map of routes that the given stops connect to.
 * Values represent the earliest marked stop in the route.
 */
export function buildQueue(
  data: Pick<DirectionsData, 'stops'>,
  markedStops: Iterable<Stop['stop_id']>
) {
  const queue = new Map<DirectionRoute['id'], StopRouteInfo>();
  for (const stopId of markedStops) {
    for (const routeInfo of data.stops[stopId].routes) {
      const existingStop = queue.get(routeInfo.route_id);
      if (!existingStop || routeInfo.sequence < existingStop.sequence) {
        queue.set(routeInfo.route_id, routeInfo);
      }
    }
  }
  return queue;
}
