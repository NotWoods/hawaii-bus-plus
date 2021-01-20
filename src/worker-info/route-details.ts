import { Mutable } from 'type-fest';
import { dbReady, SearchRoute } from '../data/database';
import type { Route, RouteWithTrips, Stop, Trip } from '../shared/gtfs-types';
import { gtfsArrivalToDate, plainTime } from '../shared/utils/date';

export interface RouteDetails {
  readonly route: RouteWithTrips;
  readonly firstStop: Stop['stop_id'];
  readonly lastStop: Stop['stop_id'];
  readonly earliest: Date;
  readonly latest: Date;
  readonly stops: Set<Stop['stop_id']>;
  readonly closestTrip: {
    readonly id: Trip['trip_id'];
    readonly minutes: number;
    readonly stop: Stop['stop_id'];
  };
}

/**
 * Find the best trip based on the current time of day,
 * along with other route details.
 * @param trips All trips for a route.
 */
export async function getRouteDetails(
  route_id: Route['route_id'],
  now: Date
): Promise<RouteDetails | undefined> {
  const db = await dbReady;

  const tx = db.transaction(['routes', 'trips']);
  const [route, trips] = await Promise.all([
    tx.objectStore('routes').get(route_id),
    tx.objectStore('trips').index('route_id').getAll(route_id),
  ]);
  if (!route) {
    return undefined;
  }

  let firstStop: Stop['stop_id'] | undefined;
  let lastStop: Stop['stop_id'] | undefined;
  let smallestSequence = Infinity;
  let largestSequence = -1;

  let earliest = plainTime(23, 59, 59);
  let latest = plainTime(0, 0, 0);

  let earliestTrip: Trip['trip_id'] | undefined;
  let earliestTripStop: Stop['stop_id'] | undefined;
  let closestTrip: Trip['trip_id'] | undefined;
  let closestTripTime = Number.MAX_VALUE;
  let closestTripStop: Stop['stop_id'] | undefined;

  const routeStops = new Set<Stop['stop_id']>();
  const tripsMap: RouteWithTrips['trips'] = {};

  for (const trip of trips) {
    tripsMap[trip.trip_id] = trip;
    for (const stopTime of trip.stop_times) {
      const sequence = stopTime.stop_sequence;
      if (trip.direction_id === 0) {
        if (sequence < smallestSequence) {
          firstStop = stopTime.stop_id;
          smallestSequence = sequence;
        }
        if (sequence > largestSequence) {
          lastStop = stopTime.stop_id;
          largestSequence = sequence;
        }
      }

      routeStops.add(stopTime.stop_id);

      const timeDate = gtfsArrivalToDate(stopTime.arrival_time);
      if (timeDate > latest) {
        latest = timeDate;
      }
      if (timeDate < earliest) {
        earliest = timeDate;
        earliestTrip = trip.trip_id;
        earliestTripStop = stopTime.stop_id;
      }

      if (
        timeDate.getTime() - now.getTime() < closestTripTime &&
        timeDate.getTime() - now.getTime() > 0
      ) {
        closestTripTime = timeDate.getTime() - now.getTime();
        closestTrip = trip.trip_id;
        closestTripStop = stopTime.stop_id;
      }
    }
    if (!closestTrip) {
      //Too late for all bus routes
      closestTripTime =
        plainTime(
          earliest.getHours() + 24,
          earliest.getMinutes(),
          earliest.getSeconds()
        ).getTime() - now.getTime();
      closestTrip = earliestTrip;
      closestTripStop = earliestTripStop;
    }
  }

  const routeNoWords = route as Route & Partial<Mutable<SearchRoute>>;
  delete routeNoWords.words;
  const routeWithTrips = routeNoWords as Mutable<RouteWithTrips>;
  routeWithTrips.trips = tripsMap;

  return {
    route: routeWithTrips,
    firstStop: firstStop!,
    lastStop: lastStop!,
    earliest,
    latest,
    stops: routeStops,
    closestTrip: {
      id: closestTrip!,
      minutes: Math.floor(closestTripTime / 60000),
      stop: closestTripStop!,
    },
  };
}
