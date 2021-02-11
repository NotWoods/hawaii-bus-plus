import { Repository } from '@hawaii-bus-plus/data';
import { Stop, StopTime, Trip } from '@hawaii-bus-plus/types';
import {
  InfinityPlainDaysTime,
  PlainDaysTime,
  skipUntil,
} from '@hawaii-bus-plus/utils';
import { DefaultMap } from 'mnemonist';
import { Temporal } from 'proposal-temporal';
import { stopsLoader } from './footpaths';
import { generateDirectionsData } from './generate-data';
import { buildQueue } from './route-queue';
import { getEarliestValidTrip, getStopTime } from './trip-times';

export interface Source {
  stop_id: Stop['stop_id'];
  departure_time: PlainDaysTime;
}

export interface PathStart {
  time: PlainDaysTime;
  transferFrom?: Stop['stop_id'];
}

export interface PathWalkSegment extends PathStart {
  transferFrom: Stop['stop_id'];
  transferTo: Stop['stop_id'];
  transferTime: Temporal.Duration;
}

export interface PathTripSegment extends PathStart {
  transferFrom: Stop['stop_id'];
  trip: Trip['trip_id'];
  stopTime: StopTime;
}

export type PathSegment = PathWalkSegment | PathTripSegment;

export type Path = [PathStart | undefined, ...(PathSegment | undefined)[]];

export type CompletePath = [PathStart, ...PathSegment[]];

function buildTimeLabels(sources: Iterable<Source>) {
  // Each stop, p, is associated with a multi-label (t_0(p), t_1(p), ...)
  // where t_i(p) represents the earliest known arrival time at p with up to i trips.
  // Initially every value is set to infinity, and t_0(p_s) is set to t.
  const multiLabel = new DefaultMap<Stop['stop_id'], Path>(() => [undefined]);
  for (const { stop_id, departure_time } of sources) {
    multiLabel.set(stop_id, [{ time: departure_time }]);
  }

  // Local pruning: We keep a value representing the earliest known arrival time at each stop.
  // earliestKnownArrival: t^*(p_i)
  const earliestKnownArrival = new Map<Stop['stop_id'], PlainDaysTime>();

  return {
    keys() {
      return multiLabel.keys();
    },
    getEarliestArrival(stopId: Stop['stop_id']) {
      return earliestKnownArrival.get(stopId) ?? InfinityPlainDaysTime;
    },
    getArrival(stopId: Stop['stop_id'], round: number) {
      const existingLabels = multiLabel.get(stopId);
      return existingLabels[round]?.time ?? InfinityPlainDaysTime;
    },
    setPath(stopId: Stop['stop_id'], round: number, path: PathSegment) {
      const existingLabels = multiLabel.get(stopId);
      existingLabels[round] = path;
      earliestKnownArrival.set(stopId, path.time);
    },
    toMap() {
      return new Map(
        Array.from(multiLabel).filter(([, value]) => value.length > 0)
      );
    },
  };
}

/**
 * Compute footpaths for RAPTOR.
 * @param markedStops Marked stops to check footpaths for. Will be modified.
 * @param k Round number.
 * @param multiLabel Map of stops to round numbers to paths.
 * @param getFootPaths
 */
async function raptorFootpaths(
  markedStops: Set<Stop['stop_id']>,
  k: number,
  timeLabels: ReturnType<typeof buildTimeLabels>,
  loadStops: (
    marked: Iterable<Stop['stop_id']>
  ) => Promise<ReadonlyMap<Stop['stop_id'], Stop>>
) {
  const footPaths = await loadStops(markedStops);
  for (const fromStopId of markedStops) {
    const transfers = footPaths.get(fromStopId)?.transfers ?? [];
    for (const { to_stop_id, min_transfer_time = 0 } of transfers) {
      // fromStopId: p
      // to_stop_id: p'

      const walkingTime = Temporal.Duration.from({
        minutes: min_transfer_time,
      });

      // currentTime: t_k(p')
      const existingTime = timeLabels.getArrival(to_stop_id, k);
      // timeWithWalking: t_k(p) + l(p, p')
      const timeWithWalking = timeLabels
        .getArrival(fromStopId, k)
        .add(walkingTime);

      // time with walking is before existing time
      if (PlainDaysTime.compare(timeWithWalking, existingTime) < 0) {
        timeLabels.setPath(to_stop_id, k, {
          time: timeWithWalking,
          transferFrom: fromStopId,
          transferTo: to_stop_id,
          transferTime: walkingTime,
        });
        markedStops.add(to_stop_id);
      }
    }
  }
}

/**
 * An implementation of the RAPTOR algorithm.
 * @see https://www.microsoft.com/en-us/research/wp-content/uploads/2012/01/raptor_alenex.pdf
 * @param sourceStop Initial stop, corresponds to p_s in set S and t in set II
 * @param departureTime Departure time, corresponds to t in set II
 */
export async function raptorDirections(
  repo: Pick<Repository, 'loadCalendars' | 'loadTrips' | 'loadStops'>,
  sources: readonly Source[],
  departureDate: Temporal.PlainDate
): Promise<ReadonlyMap<Stop['stop_id'], Path>> {
  const data = await generateDirectionsData(repo, departureDate);
  const loadStops = stopsLoader(repo);

  // The algorithm works in rounds.
  // Each round, k, computes the fastest way of getting to every stop with up to k trips.
  // Note that some stops may not be reachable at all.
  const K = Infinity;

  // Each stop, p, is associated with a multi-label (t_0(p), t_1(p), ...)
  // where t_i(p) represents the earliest known arrival time at p with up to i trips.
  // Initially every value is set to infinity, and t_0(p_s) is set to t.
  const timeLabels = buildTimeLabels(sources);

  const markedStops = new Set(timeLabels.keys());
  await raptorFootpaths(markedStops, 0, timeLabels, loadStops);

  for (let k = 1; k <= K; k++) {
    // Invariant: at the beginning of round k,
    // the first k entries in t(p), aka (t_0(p),...,t_k-1(p)), are correct.

    // The goal of round k is to compute t_k(p) for every stop p.

    // At the beginning of round k, we loop through all marked stops
    // to find all routes that contain them. Only routes from the
    // resulting set Q are considered for scanning in round k.
    const queue = buildQueue(data, markedStops);
    markedStops.clear();

    // Stage 1: copy last round's earliest arrival times for every stop,
    // which sets an upper bound.
    // Dropped because local pruning is used.

    // Stage 2: Process each route in the timetable once.
    // When processing route r, consider journeys where the last trip taken is in route r.
    for (const [routeId, hopOnStop] of queue) {
      // hopOnStop: p
      // route: r
      const route = data.routes[routeId];
      // earliestTripId: et(r, p_i)
      let earliestTrip: Trip | undefined;
      const stopsBeginningWith = skipUntil(
        route.stops,
        (stopId) => stopId === hopOnStop.stop_id
      );
      for (const stopId of stopsBeginningWith) {
        // stopId: p_i

        const stopTime = earliestTrip && getStopTime(earliestTrip, stopId);
        const arrival = stopTime && PlainDaysTime.from(stopTime.arrival_time);
        const earliestArrival = timeLabels.getEarliestArrival(stopId);

        // Can the label be improved in this round?
        // If earliestTrip is not undefined,
        // and arrival is less than the earliest known arrival time
        if (arrival && PlainDaysTime.compare(arrival, earliestArrival) < 0) {
          timeLabels.setPath(stopId, k, {
            time: arrival,
            trip: earliestTrip!.trip_id,
            stopTime: stopTime!,
            transferFrom: hopOnStop.stop_id,
          });
          markedStops.add(stopId);
        }

        // Can we catch an earlier trip at p_i?
        earliestTrip =
          getEarliestValidTrip(
            route,
            stopId,
            timeLabels.getArrival(stopId, k - 1)
          ) ?? earliestTrip;
      }
    }

    // Stage 3: consider foot-paths.
    await raptorFootpaths(markedStops, k, timeLabels, loadStops);

    // The algorithm can be stopped if no label t_k(p) was improved.
    if (markedStops.size === 0) break;
  }

  return timeLabels.toMap();
}
