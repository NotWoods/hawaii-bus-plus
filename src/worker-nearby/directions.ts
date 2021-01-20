import { DefaultMap } from 'mnemonist';
import { Temporal } from 'proposal-temporal';
import { dbReady } from '../data/database';
import { Stop } from '../shared/gtfs-types';
import { PlainDaysTime } from '../shared/utils/temporal';
import { footPathsLoader } from './directions/footpaths';
import { generateDirectionsData } from './directions/generate-data';
import { buildQueue } from './directions/route-queue';
import { arrivalTime, getEarliestValidTrip } from './directions/trip-times';

/**
 * An implementation of the RAPTOR algorithm.
 * @see https://www.microsoft.com/en-us/research/wp-content/uploads/2012/01/raptor_alenex.pdf
 * @param sourceStop Initial stop, corresponds to p_s in set S
 * @param departureTime Departure time, corresponds to t in set II
 */
export async function raptorDirections(
  sourceStopId: Stop['stop_id'],
  departureTime: Temporal.PlainDateTime
) {
  const db = await dbReady;
  const data = await generateDirectionsData(db, departureTime.toPlainDate());
  const getFootPaths = footPathsLoader(db);

  // The algorithm works in rounds.
  // Each round, k, computes the fastest way of getting to every stop with up to k trips.
  // Note that some stops may not be reachable at all.
  const K = 2;

  // Each stop, p, is associated with a multi-label (t_0(p), t_1(p), ...)
  // where t_i(p) represents the earliest known arrival time at p with up to i trips.
  // Initially every value is set to infinity, and t_0(p_s) is set to t.
  const multiLabel = new DefaultMap<Stop['stop_id'], PlainDaysTime[]>(() => []);
  multiLabel.set(sourceStopId, [
    new PlainDaysTime(0, departureTime.toPlainTime()),
  ]);

  // Local pruning: We keep a value representing the earliest known arrival time at each stop.
  // earliestKnownArrival: t^*(p_i)
  const earliestKnownArrival = new Map<Stop['stop_id'], PlainDaysTime>();

  const markedStops = new Set([sourceStopId]);

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
    for (const routeId of queue.keys()) {
      // route: r
      const route = data.routes[routeId];
      // earliestTripId: et(r, p_i)
      let earliestTrip = undefined;
      for (const stopId of route.stops) {
        // stopId: p_i

        const existingLabels = multiLabel.get(stopId);
        const arrival = earliestTrip && arrivalTime(earliestTrip, stopId);
        // undefined represents Infinity
        const earliestArrival = earliestKnownArrival.get(stopId);

        // Can the label be improved in this round?
        // If earliestTrip is not undefined,
        // and arrival is less than the earliest known arrival time
        if (
          arrival &&
          (earliestArrival == undefined ||
            PlainDaysTime.compare(arrival, earliestArrival) < 0)
        ) {
          existingLabels[k] = arrival;
          earliestKnownArrival.set(stopId, arrival);
          markedStops.add(stopId);
        } else {
          // Can we catch an earlier trip at p_i?
          earliestTrip = getEarliestValidTrip(
            route,
            stopId,
            existingLabels[k - 1]
          );
        }
      }
    }

    // Stage 3: consider foot-paths.
    const footPaths = await getFootPaths(markedStops);
    for (const fromStopId of markedStops) {
      const transfers = footPaths.get(fromStopId)!;
      for (const transfer of transfers) {
        const timeWithWalking = multiLabel
          .get(fromStopId)
          [k - 1].add({ minutes: transfer.min_transfer_time || 0 });
        const existingLabels = multiLabel.get(transfer.to_stop_id);

        if (PlainDaysTime.compare(timeWithWalking, existingLabels[k]) < 0) {
          existingLabels[k] = timeWithWalking;
          markedStops.add(transfer.to_stop_id);
        }
      }
    }

    // The algorithm can be stopped if no label t_k(p) was improved.
    if (markedStops.size === 0) break;
  }

  return earliestKnownArrival;
}
