import { Repository } from '@hawaii-bus-plus/data';
import type {
  Route,
  Stop,
  StopTime,
  TimeString,
  Trip,
} from '@hawaii-bus-plus/types';
import {
  InfinityPlainDaysTime,
  PlainDaysTime,
  serviceRunningOn,
} from '@hawaii-bus-plus/utils';
import { Temporal } from 'proposal-temporal';

export interface ZonedTime {
  /** Milliseconds since epoch, used to build Date object. */
  epochMilliseconds: number;
  /** ISO string usable in <time datetime=""> attribute. */
  string: string;
}

export interface TemporalStopTime
  extends Omit<StopTime, 'arrival_time' | 'departure_time'> {
  arrival_time: ZonedTime;
  departure_time: ZonedTime;
}

export interface DirectionDetails {
  readonly firstStop: Stop['stop_id'];
  readonly lastStop: Stop['stop_id'];
  readonly earliest: ZonedTime;
  readonly latest: ZonedTime;
  readonly closestTrip: {
    readonly trip: Trip;
    readonly offset: string;
    readonly stop: Stop['stop_id'];
    readonly stopTimes: readonly TemporalStopTime[];
  };
}

interface DirectionDetailsMutable {
  firstStop?: Stop['stop_id'];
  lastStop?: Stop['stop_id'];
  smallestSequence: number;
  largestSequence: number;

  earliest: PlainDaysTime;
  latest: PlainDaysTime;
  earliestTrip: {
    trip?: Trip;
    stop?: Stop['stop_id'];
  };
  closestTrip: {
    trip?: Trip;
    // undefined represents Infinity
    offset?: Temporal.Duration;
    stop?: Stop['stop_id'];
  };
}

export interface RouteDetails {
  readonly route: Route;
  readonly descParts: {
    type: 'text' | 'link';
    value: string;
  }[];
  readonly stops: Set<Stop['stop_id']>;
  readonly timeZone: string;

  readonly directions: DirectionDetails[];
}

function emptyDirectionDetails(): DirectionDetailsMutable {
  return {
    smallestSequence: Infinity,
    largestSequence: -1,
    earliest: InfinityPlainDaysTime,
    latest: new PlainDaysTime(),
    closestTrip: {},
    earliestTrip: {},
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
  repo: Pick<
    Repository,
    'loadRoute' | 'loadAgency' | 'loadTripsForRoute' | 'loadCalendars'
  >,
  route_id: Route['route_id'],
  now?: Temporal.PlainDateTime
): Promise<RouteDetails | undefined> {
  const allCalendarsReady = repo.loadCalendars();
  const route = await repo.loadRoute(route_id);
  if (!route) {
    return undefined;
  }

  const agency = await repo.loadAgency(route.agency_id);
  const timeZone = agency!.agency_timezone;
  const nowZoned = now || nowInZone(timeZone);
  const nowTime = nowZoned.toPlainTime();
  const nowDate = nowZoned.toPlainDate();

  const directionDetails: DirectionDetailsMutable[] = [];

  const routeStops = new Set<Stop['stop_id']>();

  const allCalendars = await allCalendarsReady;
  let cursor = await repo.loadTripsForRoute(route_id);
  while (cursor) {
    const trip = cursor.value;

    if (serviceRunningOn(allCalendars, trip.service_id, nowDate)) {
      for (const stopTime of trip.stop_times) {
        const dirId = trip.direction_id;
        if (!directionDetails[dirId]) {
          directionDetails[dirId] = emptyDirectionDetails();
        }
        const dirDetails = directionDetails[dirId];

        const sequence = stopTime.stop_sequence;
        if (sequence < dirDetails.smallestSequence) {
          dirDetails.firstStop = stopTime.stop_id;
          dirDetails.smallestSequence = sequence;
        }
        if (sequence > dirDetails.largestSequence) {
          dirDetails.lastStop = stopTime.stop_id;
          dirDetails.largestSequence = sequence;
        }

        routeStops.add(stopTime.stop_id);

        const arrivalTime = PlainDaysTime.from(stopTime.arrival_time);
        if (PlainDaysTime.compare(arrivalTime, dirDetails.latest) > 0) {
          dirDetails.latest = arrivalTime;
        }
        if (PlainDaysTime.compare(arrivalTime, dirDetails.earliest) < 0) {
          dirDetails.earliest = arrivalTime;
          dirDetails.earliestTrip.trip = trip;
          dirDetails.earliestTrip.stop = stopTime.stop_id;
        }

        const timeUntil = nowTime.until(arrivalTime);
        // If timeUntil is a positive duration
        if (Temporal.Duration.compare(ZERO_DURATION, timeUntil) <= 0) {
          // and timeUntil is less than closestTripOffset
          const closest = dirDetails.closestTrip;
          if (
            !closest.offset ||
            Temporal.Duration.compare(timeUntil, closest.offset) < 0
          ) {
            closest.offset = timeUntil;
            closest.trip = trip;
            closest.stop = stopTime.stop_id;
          }
        }
      }
    }

    cursor = await cursor.continue();
  }

  function zonedTime(time: TimeString | PlainDaysTime): ZonedTime {
    const daysTime = PlainDaysTime.from(time);
    const dateTime = daysTime
      .toPlainTime()
      .toPlainDateTime(nowDate)
      .add({ days: daysTime.day });
    const zoned = dateTime.toZonedDateTime(timeZone);

    return {
      epochMilliseconds: zoned.epochMilliseconds,
      string: time.toString(),
    };
  }

  return {
    route,
    descParts: extractLinks(route.route_desc),
    stops: routeStops,
    timeZone,
    directions: directionDetails.map((dirDetails) => {
      if (!dirDetails.closestTrip.trip) {
        const { closestTrip, earliestTrip, earliest } = dirDetails;
        // Too late for all bus routes
        closestTrip.offset = nowTime
          .until(earliest.toPlainTime())
          .add({ days: 1 });
        closestTrip.trip = earliestTrip.trip;
        closestTrip.stop = earliestTrip.stop;
      }

      return {
        firstStop: dirDetails.firstStop!,
        lastStop: dirDetails.lastStop!,
        earliest: zonedTime(dirDetails.earliest),
        latest: zonedTime(dirDetails.latest),
        closestTrip: {
          trip: dirDetails.closestTrip.trip!,
          offset: dirDetails.closestTrip.offset!.toString(),
          stop: dirDetails.closestTrip.stop!,
          stopTimes: dirDetails.closestTrip.trip!.stop_times.map((st) => ({
            ...st,
            arrival_time: zonedTime(st.arrival_time),
            departure_time: zonedTime(st.departure_time),
          })),
        },
      };
    }),
  };
}
