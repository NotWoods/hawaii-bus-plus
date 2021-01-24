import { Repository } from '@hawaii-bus-plus/data';
import { Stop, Trip } from '@hawaii-bus-plus/types';
import {
  InfinityPlainDaysTime,
  PlainDaysTime,
  skipUntil,
} from '@hawaii-bus-plus/utils';
import { DefaultMap } from 'mnemonist';
import { Temporal } from 'proposal-temporal';
import { footPathsLoader } from './footpaths';
import { generateDirectionsData } from './generate-data';
import { buildQueue } from './route-queue';
import { arrivalTime, getEarliestValidTrip } from './trip-times';

export interface Source {
  stop_id: Stop['stop_id'];
  departure_time: PlainDaysTime;
}

export interface Path {
  time: PlainDaysTime;
  trip?: Trip['trip_id'];
  transfer_from?: Stop['stop_id'];
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
) {
  const data = await generateDirectionsData(repo, departureDate);
  const getFootPaths = footPathsLoader(repo);

  // The algorithm works in rounds.
  // Each round, k, computes the fastest way of getting to every stop with up to k trips.
  // Note that some stops may not be reachable at all.
  const K = Infinity;

  // Each stop, p, is associated with a multi-label (t_0(p), t_1(p), ...)
  // where t_i(p) represents the earliest known arrival time at p with up to i trips.
  // Initially every value is set to infinity, and t_0(p_s) is set to t.
  const multiLabel = new DefaultMap<Stop['stop_id'], Path[]>(() => []);
  for (const { stop_id, departure_time } of sources) {
    multiLabel.set(stop_id, [{ time: departure_time }]);
  }

  // Local pruning: We keep a value representing the earliest known arrival time at each stop.
  // earliestKnownArrival: t^*(p_i)
  const earliestKnownArrival = new Map<Stop['stop_id'], PlainDaysTime>();

  const markedStops = new Set(multiLabel.keys());

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
      let earliestTrip: Trip | undefined = undefined;
      const stopsBeginningWith = skipUntil(
        route.stops,
        (stopId) => stopId === hopOnStop.stop_id
      );
      for (const stopId of stopsBeginningWith) {
        // stopId: p_i

        const existingLabels = multiLabel.get(stopId);
        const arrival = earliestTrip && arrivalTime(earliestTrip, stopId);

        const earliestArrival =
          earliestKnownArrival.get(stopId) || InfinityPlainDaysTime;

        // Can the label be improved in this round?
        // If earliestTrip is not undefined,
        // and arrival is less than the earliest known arrival time
        if (arrival && PlainDaysTime.compare(arrival, earliestArrival) < 0) {
          existingLabels[k] = {
            time: arrival,
            trip: earliestTrip!.trip_id,
            transfer_from: hopOnStop.stop_id,
          };
          earliestKnownArrival.set(stopId, arrival);
          markedStops.add(stopId);
        }

        // Can we catch an earlier trip at p_i?
        earliestTrip =
          getEarliestValidTrip(
            route,
            stopId,
            existingLabels[k - 1]?.time || InfinityPlainDaysTime
          ) || earliestTrip;
      }
    }

    // Stage 3: consider foot-paths.
    const footPaths = await getFootPaths(markedStops);
    for (const fromStopId of markedStops) {
      const transfers = footPaths.get(fromStopId) || [];
      for (const { to_stop_id, min_transfer_time = 0 } of transfers) {
        // fromStopId: p
        // to_stop_id: p'
        const existingFromLabels = multiLabel.get(fromStopId);
        const existingToLabels = multiLabel.get(to_stop_id);

        // currentTime: t_k(p')
        const existingTime = existingToLabels[k]?.time;
        // timeWithWalking: t_k(p) + l(p, p')
        const timeWithWalking = existingFromLabels[k]?.time?.add({
          minutes: min_transfer_time,
        });

        const timeWithWalkingBeforeExistingTime =
          PlainDaysTime.compare(
            timeWithWalking || InfinityPlainDaysTime,
            existingTime || InfinityPlainDaysTime
          ) < 0;
        if (timeWithWalkingBeforeExistingTime) {
          existingToLabels[k] = {
            time: timeWithWalking,
            transfer_from: fromStopId,
          };
          markedStops.add(to_stop_id);
        }
      }
    }

    // The algorithm can be stopped if no label t_k(p) was improved.
    if (markedStops.size === 0) break;
  }

  return new Map(
    Array.from(multiLabel).filter(([, value]) => value.length > 0)
  );
}
