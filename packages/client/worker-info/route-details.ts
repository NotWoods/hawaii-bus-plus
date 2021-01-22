import { Repository } from '@hawaii-bus-plus/data';
import type {
  Route,
  RouteWithTrips,
  Stop,
  StopTime,
  TimeString,
  Trip,
} from '@hawaii-bus-plus/types';
import { InfinityPlainDaysTime, PlainDaysTime } from '@hawaii-bus-plus/utils';
import { Temporal } from 'proposal-temporal';

export interface TemporalStopTime
  extends Omit<StopTime, 'arrival_time' | 'departure_time'> {
  arrival_time: Temporal.ZonedDateTime;
  departure_time: Temporal.ZonedDateTime;
}

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
    readonly until: Temporal.Duration;
    readonly stop: Stop['stop_id'];
    readonly stopTimes: readonly TemporalStopTime[];
  };
}

const LINK_REGEX = /(https?:\/\/[.a-z\/]+)/g;
const ZERO_DURATION = new Temporal.Duration();

/**
 * Find the best trip based on the current time of day,
 * along with other route details.
 * @param trips All trips for a route.
 */
export async function getRouteDetails(
  repo: Pick<Repository, 'loadRoute' | 'loadAgency'>,
  route_id: Route['route_id'],
  now: Temporal.PlainDateTime
): Promise<RouteDetails | undefined> {
  const route = await repo.loadRoute(route_id);
  if (!route) {
    return undefined;
  }

  const nowTime = now.toPlainTime();

  let firstStop: Stop['stop_id'] | undefined;
  let lastStop: Stop['stop_id'] | undefined;
  let smallestSequence = Infinity;
  let largestSequence = -1;

  let earliest = InfinityPlainDaysTime;
  let latest = new PlainDaysTime();

  let earliestTrip: Trip['trip_id'] | undefined;
  let earliestTripStop: Stop['stop_id'] | undefined;
  let closestTrip: Trip['trip_id'] | undefined;
  let closestTripOffset = new Temporal.Duration(1);
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

      const arrivalTime = PlainDaysTime.from(stopTime.arrival_time);
      if (arrivalTime > latest) {
        latest = arrivalTime;
      }
      if (arrivalTime < earliest) {
        earliest = arrivalTime;
        earliestTrip = trip.trip_id;
        earliestTripStop = stopTime.stop_id;
      }

      // TODO change to use compare
      const timeUntil = nowTime.until(arrivalTime);
      if (Temporal.Duration.compare(ZERO_DURATION, timeUntil) <= 0) {
        if (Temporal.Duration.compare(timeUntil, closestTripOffset) < 0) {
          closestTripOffset = timeUntil;
          closestTrip = trip.trip_id;
          closestTripStop = stopTime.stop_id;
        }
      }
    }
    if (!closestTrip) {
      // Too late for all bus routes
      closestTripOffset = nowTime
        .until(earliest.toPlainTime())
        .add({ days: 1 });
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

  const nowDate = now.toPlainDate();
  const agency = await repo.loadAgency(route.agency_id);
  function zonedTime(time: TimeString) {
    const daysTime = PlainDaysTime.from(time);
    const dateTime = daysTime
      .toPlainTime()
      .toPlainDateTime(nowDate)
      .add({ days: daysTime.day });
    return dateTime.toZonedDateTime(agency!.agency_timezone);
  }

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
      until: closestTripOffset,
      stop: closestTripStop!,
      stopTimes: route.trips[closestTrip!].stop_times.map((st) => ({
        ...st,
        arrival_time: zonedTime(st.arrival_time),
        departure_time: zonedTime(st.departure_time),
      })),
    },
  };
}
