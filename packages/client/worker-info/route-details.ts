import { Repository } from '@hawaii-bus-plus/data';
import type { Route, RouteWithTrips, Stop, Trip } from '@hawaii-bus-plus/types';
import {
  gtfsArrivalToDate,
  InfinityPlainDaysTime,
  PlainDaysTime,
  plainTime,
} from '@hawaii-bus-plus/utils';

export interface RouteDetails {
  readonly route: RouteWithTrips;
  readonly firstStop: Stop['stop_id'];
  readonly lastStop: Stop['stop_id'];
  readonly earliest: PlainDaysTime;
  readonly latest: PlainDaysTime;
  readonly stops: Set<Stop['stop_id']>;
  readonly descParts: {
    type: 'text' | 'link';
    value: string;
  }[];
  readonly closestTrip: {
    readonly id: Trip['trip_id'];
    readonly minutes: number;
    readonly stop: Stop['stop_id'];
  };
}

const LINK_REGEX = /(https?:\/\/[.a-z\/]+)/g;

/**
 * Find the best trip based on the current time of day,
 * along with other route details.
 * @param trips All trips for a route.
 */
export async function getRouteDetails(
  repo: Pick<Repository, 'loadRoute'>,
  route_id: Route['route_id'],
  now: Date
): Promise<RouteDetails | undefined> {
  const route = await repo.loadRoute(route_id);
  if (!route) {
    return undefined;
  }

  let firstStop: Stop['stop_id'] | undefined;
  let lastStop: Stop['stop_id'] | undefined;
  let smallestSequence = Infinity;
  let largestSequence = -1;

  let earliest = InfinityPlainDaysTime;
  let latest = plainTime(0, 0, 0);

  let earliestTrip: Trip['trip_id'] | undefined;
  let earliestTripStop: Stop['stop_id'] | undefined;
  let closestTrip: Trip['trip_id'] | undefined;
  let closestTripTime = Number.MAX_VALUE;
  let closestTripStop: Stop['stop_id'] | undefined;

  const routeStops = new Set<Stop['stop_id']>();

  for (const trip of Object.values(route.trips)) {
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

      // TODO change to use compare
      if (
        timeDate.valueOf() - now.valueOf() < closestTripTime &&
        timeDate.valueOf() - now.valueOf() > 0
      ) {
        closestTripTime = timeDate.valueOf() - now.valueOf();
        closestTrip = trip.trip_id;
        closestTripStop = stopTime.stop_id;
      }
    }
    if (!closestTrip) {
      //Too late for all bus routes
      closestTripTime = earliest.add({ days: 1 }).valueOf() - now.valueOf();
      closestTrip = earliestTrip;
      closestTripStop = earliestTripStop;
    }
  }

  let descLastIndex = 0;
  const descParts: RouteDetails['descParts'] = [];
  for (const match of route.route_desc.matchAll(LINK_REGEX)) {
    const end = match.index! + match[0].length;
    const textPart = route.route_desc.slice(descLastIndex, match.index);
    const linkPart = route.route_desc.slice(match.index, end);
    descParts.push(
      { type: 'text', value: textPart },
      { type: 'link', value: linkPart }
    );
    descLastIndex = end;
  }
  descParts.push({
    type: 'text',
    value: route.route_desc.slice(descLastIndex),
  });

  return {
    route,
    firstStop: firstStop!,
    lastStop: lastStop!,
    earliest,
    latest,
    stops: routeStops,
    descParts,
    closestTrip: {
      id: closestTrip!,
      minutes: Math.floor(closestTripTime / 60000),
      stop: closestTripStop!,
    },
  };
}
