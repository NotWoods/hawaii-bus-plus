import { Repository } from '@hawaii-bus-plus/data';
import type {
  Route,
  Stop,
  StopTime,
  TimeString,
  Trip,
} from '@hawaii-bus-plus/types';
import { InfinityPlainDaysTime, PlainDaysTime } from '@hawaii-bus-plus/utils';
import { Temporal } from 'proposal-temporal';

export interface TemporalStopTime
  extends Omit<StopTime, 'arrival_time' | 'departure_time'> {
  arrival_time: { epochMilliseconds: number; string: string };
  departure_time: { epochMilliseconds: number; string: string };
}

export interface RouteDetails {
  readonly route: Route;
  readonly firstStop: Stop['stop_id'];
  readonly lastStop: Stop['stop_id'];
  readonly earliest: PlainDaysTime;
  readonly latest: PlainDaysTime;
  readonly stops: Set<Stop['stop_id']>;
  readonly descParts: {
    type: 'text' | 'link';
    value: string;
  }[];
  readonly timeZone: string;
  readonly closestTrip: {
    readonly trip: Trip;
    readonly until: Temporal.Duration;
    readonly stop: Stop['stop_id'];
    readonly stopTimes: readonly TemporalStopTime[];
  };
}

const LINK_REGEX = /(https?:)\s?(\/\/[.a-z\/]+)/g;
const ZERO_DURATION = new Temporal.Duration();

function nowInZone(timeZone: string | Temporal.TimeZoneProtocol) {
  const now = Temporal.now.zonedDateTimeISO();
  return now.withTimeZone(timeZone).toPlainDateTime();
}

export function extractLinks(description: string) {
  let descLastIndex = 0;
  const descParts: RouteDetails['descParts'] = [];
  for (const match of description.matchAll(LINK_REGEX)) {
    const end = match.index! + match[0].length;
    const textPart = description.slice(descLastIndex, match.index);
    const linkPart = match[1] + match[2];
    descParts.push(
      { type: 'text', value: textPart },
      { type: 'link', value: linkPart }
    );
    descLastIndex = end;
  }
  descParts.push({
    type: 'text',
    value: description.slice(descLastIndex),
  });
  return descParts;
}

/**
 * Find the best trip based on the current time of day,
 * along with other route details.
 * @param trips All trips for a route.
 */
export async function getRouteDetails(
  repo: Pick<Repository, 'loadRoute' | 'loadAgency' | 'loadTripsForRoute'>,
  route_id: Route['route_id'],
  now?: Temporal.PlainDateTime
): Promise<RouteDetails | undefined> {
  const route = await repo.loadRoute(route_id);
  if (!route) {
    return undefined;
  }

  const agency = await repo.loadAgency(route.agency_id);
  const timeZone = agency!.agency_timezone;
  const nowZoned = now || nowInZone(timeZone);
  const nowTime = nowZoned.toPlainTime();
  const nowDate = nowZoned.toPlainDate();

  let firstStop: Stop['stop_id'] | undefined;
  let lastStop: Stop['stop_id'] | undefined;
  let smallestSequence = Infinity;
  let largestSequence = -1;

  let earliest = InfinityPlainDaysTime;
  let latest = new PlainDaysTime();

  let earliestTrip: Trip | undefined;
  let earliestTripStop: Stop['stop_id'] | undefined;
  let closestTrip: Trip | undefined;
  let closestTripOffset: Temporal.Duration | undefined;
  let closestTripStop: Stop['stop_id'] | undefined;

  const routeStops = new Set<Stop['stop_id']>();

  let cursor = await repo.loadTripsForRoute(route_id);
  while (cursor) {
    const trip = cursor.value;
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
      if (PlainDaysTime.compare(arrivalTime, latest) > 0) {
        latest = arrivalTime;
      }
      if (PlainDaysTime.compare(arrivalTime, earliest) < 0) {
        earliest = arrivalTime;
        earliestTrip = trip;
        earliestTripStop = stopTime.stop_id;
      }

      // TODO change to use compare
      const timeUntil = nowTime.until(arrivalTime);
      if (Temporal.Duration.compare(ZERO_DURATION, timeUntil) <= 0) {
        if (
          !closestTripOffset ||
          Temporal.Duration.compare(timeUntil, closestTripOffset) < 0
        ) {
          closestTripOffset = timeUntil;
          closestTrip = trip;
          closestTripStop = stopTime.stop_id;
        }
      }
    }

    cursor = await cursor.continue();
  }

  if (!closestTrip) {
    // Too late for all bus routes
    closestTripOffset = nowTime.until(earliest.toPlainTime()).add({ days: 1 });
    closestTrip = earliestTrip;
    closestTripStop = earliestTripStop;
  }

  function zonedTime(time: TimeString) {
    const daysTime = PlainDaysTime.from(time);
    const dateTime = daysTime
      .toPlainTime()
      .toPlainDateTime(nowDate)
      .add({ days: daysTime.day });
    const zoned = dateTime.toZonedDateTime(timeZone);
    return { epochMilliseconds: zoned.epochMilliseconds, string: time };
  }

  return {
    route,
    firstStop: firstStop!,
    lastStop: lastStop!,
    earliest,
    latest,
    stops: routeStops,
    descParts: extractLinks(route.route_desc),
    timeZone,
    closestTrip: {
      trip: closestTrip!,
      until: closestTripOffset!,
      stop: closestTripStop!,
      stopTimes: closestTrip!.stop_times.map((st) => ({
        ...st,
        arrival_time: zonedTime(st.arrival_time),
        departure_time: zonedTime(st.departure_time),
      })),
    },
  };
}
