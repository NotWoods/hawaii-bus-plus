import { omitStopTimes, Repository } from '@hawaii-bus-plus/data';
import {
  DurationData,
  PlainTimeData,
  StopTimeData,
} from '@hawaii-bus-plus/presentation';
import {
  InfinityPlainDaysTime,
  nextServiceDay,
  PlainDaysTime,
} from '@hawaii-bus-plus/temporal-utils';
import type {
  Calendar,
  Route,
  Stop,
  TimeString,
  Trip,
  TripWithoutTimes,
} from '@hawaii-bus-plus/types';
import { Temporal } from 'proposal-temporal';
import { loadCalendarAgency, routeStopDetails } from './shared';
import { FormatOptions, formatStopTime } from './stop-time';

interface TripSlice {
  tripId: Trip['trip_id'];
  shortName: string;
  time: TimeString;
}

export interface TripDetails {
  readonly trip: TripWithoutTimes;
  readonly stopTimes: readonly StopTimeData[];
  readonly serviceDays?: string;
}

export interface DirectionDetails {
  readonly firstStop: Stop['stop_id'];
  readonly firstStopName: string;
  readonly lastStop: Stop['stop_id'];
  readonly lastStopName: string;

  readonly earliest: PlainTimeData;
  readonly latest: PlainTimeData;

  readonly allTrips: ReadonlyMap<Trip['trip_id'], TripSlice>;
  readonly closestTrip: TripDetails & {
    readonly offset: DurationData;
    readonly stop: Stop['stop_id'];
    readonly stopName: string;
  };
}

interface DirectionDetailsMutable {
  firstStop?: Stop['stop_id'];
  lastStop?: Stop['stop_id'];
  smallestSequence: number;
  largestSequence: number;

  allTrips: Map<Trip['trip_id'], TripSlice>;

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
    allTrips: new Map(),
    closestTrip: {},
    earliestTrip: {},
  };
}

const ZERO_DURATION = new Temporal.Duration();

export function formatTripDetails(
  trip: Trip,
  allCalendars: ReadonlyMap<Calendar['service_id'], Calendar>,
  options: FormatOptions
): TripDetails {
  return {
    trip: omitStopTimes(trip),
    stopTimes: trip.stop_times.map((st) => formatStopTime(st, options)),
    serviceDays: allCalendars.get(trip.service_id)?.service_name,
  };
}

export async function getTripDetails(
  repo: Pick<
    Repository,
    'loadRoutes' | 'loadAgencies' | 'loadTrip' | 'loadCalendars' | 'loadStops'
  >,
  routeId: Route['route_id'],
  tripId: Trip['trip_id'],
  date?: Temporal.PlainDate
): Promise<TripDetails | undefined> {
  const [neededInfo, trip] = await Promise.all([
    loadCalendarAgency(repo, routeId, date),
    repo.loadTrip(tripId),
  ]);
  if (!neededInfo || !trip) return undefined;

  const routeStops = new Set(trip.stop_times.flatMap((st) => st.stop_id));
  const { stops, routes } = await routeStopDetails(repo, routeStops, routeId);

  return formatTripDetails(trip, neededInfo.allCalendars, {
    serviceDate: neededInfo.serviceDate,
    timeZone: neededInfo.timeZone,
    stops,
    routes,
  });
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
): Promise<{
  directionDetails: readonly DirectionDetailsResult[];
  routeStops: ReadonlySet<Stop['stop_id']>;
  routeService: Iterable<Calendar>;
}> {
  const nowTime = new PlainDaysTime(0, now.toPlainTime());
  const nowDate = now.toPlainDate();

  const directionDetails: DirectionDetailsMutable[] = [];
  const routeStops = new Set<Stop['stop_id']>();
  const routeService = new Map<Calendar['service_id'], Calendar>();

  let cursor = await repo.loadTripsForRoute(routeId);
  while (cursor) {
    const trip = cursor.value;

    const calendar = allCalendars.get(trip.service_id);
    if (calendar) {
      routeService.set(trip.service_id, calendar);

      const dirId = trip.direction_id;
      if (!directionDetails[dirId]) {
        directionDetails[dirId] = emptyDirectionDetails();
      }
      const dirDetails = directionDetails[dirId];
      dirDetails.allTrips.set(trip.trip_id, {
        tripId: trip.trip_id,
        shortName: trip.trip_short_name,
        time: trip.stop_times[0].arrival_time,
      });

      const { addedDays } = nextServiceDay(calendar, nowDate);

      for (const stopTime of trip.stop_times) {
        routeStops.add(stopTime.stop_id);

        const sequence = stopTime.stop_sequence;
        if (sequence < dirDetails.smallestSequence) {
          dirDetails.firstStop = stopTime.stop_id;
          dirDetails.smallestSequence = sequence;
        }
        if (sequence > dirDetails.largestSequence) {
          dirDetails.lastStop = stopTime.stop_id;
          dirDetails.largestSequence = sequence;
        }

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
    routeService: routeService.values(),
    directionDetails: directionDetails.map((directionDetail) => {
      if (!directionDetail.closestTrip.trip) {
        const { closestTrip, earliestTrip, earliest } = directionDetail;
        // Too late for all bus routes
        closestTrip.offset = nowTime.until(earliest.add({ days: 1 }));
        closestTrip.trip = earliestTrip.trip;
        closestTrip.stop = earliestTrip.stop;
      }

      return directionDetail as DirectionDetailsResult;
    }),
  };
}
