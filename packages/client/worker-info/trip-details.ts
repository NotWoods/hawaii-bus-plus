import { Repository } from '@hawaii-bus-plus/data';
import {
  DurationData,
  PlainTimeData,
  plainTimeToData,
  StopTimeData,
} from '@hawaii-bus-plus/presentation';
import type {
  Calendar,
  Route,
  Stop,
  TimeString,
  Trip,
  TripWithoutTimes,
} from '@hawaii-bus-plus/types';
import {
  InfinityPlainDaysTime,
  nextServiceDay,
  PlainDaysTime,
} from '@hawaii-bus-plus/utils';
import { Temporal } from 'proposal-temporal';

export interface DirectionDetails {
  readonly firstStop: Stop['stop_id'];
  readonly firstStopName: string;
  readonly lastStop: Stop['stop_id'];
  readonly lastStopName: string;
  readonly earliest: PlainTimeData;
  readonly latest: PlainTimeData;
  readonly closestTrip: {
    readonly trip: TripWithoutTimes;
    readonly offset: DurationData;
    readonly stop: Stop['stop_id'];
    readonly stopName: string;
    readonly stopTimes: readonly StopTimeData[];
    readonly serviceDays?: string;
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

interface DirectionDetailsResult extends Required<DirectionDetailsMutable> {
  earliestTrip: Required<DirectionDetailsMutable['earliestTrip']>;
  closestTrip: Required<DirectionDetailsMutable['closestTrip']>;
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

const ZERO_DURATION = new Temporal.Duration();

export function zonedTime(
  time: TimeString | PlainDaysTime,
  serviceDate: Temporal.PlainDate,
  timeZone: string | Temporal.TimeZoneProtocol
): PlainTimeData {
  return plainTimeToData(PlainDaysTime.from(time), serviceDate, timeZone);
}

/**
 * Find the best trip in each direction based on the current time of day,
 * along with other route details.
 */
export async function findBestTrips(
  repo: Pick<Repository, 'loadTripsForRoute'>,
  routeId: Route['route_id'],
  allCalendars: ReadonlyMap<Calendar['service_id'], Calendar>,
  now: Temporal.PlainDateTime
) {
  const nowTime = new PlainDaysTime(0, now.toPlainTime());
  const nowDate = now.toPlainDate();

  const directionDetails: DirectionDetailsMutable[] = [];
  const routeStops = new Set<Stop['stop_id']>();

  let cursor = await repo.loadTripsForRoute(routeId);
  while (cursor) {
    const trip = cursor.value;

    const calendar = allCalendars.get(trip.service_id);
    if (calendar) {
      for (const stopTime of trip.stop_times) {
        routeStops.add(stopTime.stop_id);

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

        const { addedDays } = nextServiceDay(calendar, nowDate);
        const arrivalTime = PlainDaysTime.from(stopTime.arrival_time).add({
          days: addedDays,
        });

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

  return {
    routeStops,
    directionDetails: directionDetails as DirectionDetailsResult[],
  };
}
