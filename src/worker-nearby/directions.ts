import { Temporal } from 'proposal-temporal';
import { dbReady } from '../data/database';
import { batch } from '../shared/batch';
import { TimeString } from '../shared/data-types';
import { Route, RouteWithTrips, Stop, Transfer } from '../shared/gtfs-types';
import { gtfsArrivalToDate, compare } from '../shared/utils/temporal';
import { findClosestStops, StopWithDistance } from './closest-stops';
import { DefaultMap } from 'mnemonist';

/**
 * An implementation of the RAPTOR algorithm.
 * @see https://www.microsoft.com/en-us/research/wp-content/uploads/2012/01/raptor_alenex.pdf
 * @param sourceStop Initial stop, corresponds to p_s in set S
 * @param departureTime Departure time, corresponds to t in set II
 */
async function raptorDirections(
  sourceStop: Stop,
  departureTime: Temporal.PlainDateTime,
  allStops: Stop[],
  allRoutes: RouteWithTrips[],
  footPaths: Map<Stop['stop_id'], Transfer>
) {
  // The algorithm works in rounds.
  // Each round, k, computes the fastest way of getting to every stop with up to k trips.
  // Note that some stops may not be reachable at all.
  const K = 2;

  // Each stop, p, is associated with a multi-label (t_0(p), t_1(p), ...)
  // where t_i(p) represents the earliest known arrival time at p with up to i trips.
  // Initially every value is set to infinity, and t_0(p_s) is set to t.
  const multiLabel = new DefaultMap<Stop['stop_id'], Temporal.PlainTime[]>(
    () => []
  );
  multiLabel.set(sourceStop.stop_id, [departureTime.toPlainTime()]);

  const markedStops = new Set([sourceStop.stop_id]);

  for (let k = 1; k <= K; k++) {
    // Invariant: at the beginning of round k,
    // the first k entries in t(p), aka (t_0(p),...,t_k-1(p)), are correct.

    // The goal of round k is to compute t_k(p) for every stop p.
    let improvedLabels = false;

    // Stage 1: copy last round's earliest arrival times for every stop,
    // which sets an upper bound.
    for (const stop of allStops) {
      const existingLabels = multiLabel.get(stop.stop_id);
      existingLabels[k] = existingLabels[k - 1];
    }

    // Stage 2: Process each route in the timetable once.
    // When processing route r, consider journeys where the last trip taken is in route r.
    for (const route of allRoutes) {
      // route: r
      for (const stop of allStops) {
        // stop: p_i
        const lastRoundLabel = multiLabel.get(stop.stop_id)[k - 1];
        // unset values indicate Infinity, so its impossible to find a trip after this time.
        if (lastRoundLabel != undefined) {
          // Let et(r, p_i) be the earliest trip one can catch at this stop p_i.
          // aka earliest trip after last round's time - t_dep(t, p_i) >= t_k-1(p_i)
          // Note that this trip may not exist.

          // earliestTrip.trip: t
          const earliestTripInfo = stop.trips
            .filter((trip) => trip.route === route.route_id)
            .find((trip) => {
              // TODO optimize out the filter
              // TODO maybe consider days here too
              const { time } = gtfsArrivalToDate(trip.time);
              return Temporal.PlainTime.compare(lastRoundLabel, time) >= 0;
            });

          if (earliestTripInfo) {
            // Let the corresponding trip t be the current trip for round k.
            // For each subsequent stop p_j, we can update t_k(p_j) using this trip.
            const earliestTrip = route.trips[earliestTripInfo.trip];
            let reachedStop = false;
            for (const stopTime of earliestTrip.stop_times) {
              // Hop on to the route at p_i
              if (reachedStop) {
                // subsequentStop: p_j
                const subsequentStop = stopTime.stop_id;
                const existingLabels = multiLabel.get(subsequentStop);
                existingLabels[k] = existingLabels[k - 1];
              } else {
                reachedStop =
                  stopTime.stop_id === stop.stop_id &&
                  stopTime.stop_sequence === earliestTripInfo.sequence;
              }
            }
          }
        }
      }
    }

    // Stage 3: consider foot-paths.
    for (const toStop of markedStops) {
      const pathTo = footPaths.get(toStop.stop_id);
      if (pathTo) {
        const existingLabels = multiLabel.get(toStop.stop_id);
        const timeWithWalking = multiLabel
          .get(pathTo.from_stop_id)
          [k - 1].add({ minutes: pathTo.min_transfer_time || 0 });
        if (
          Temporal.PlainTime.compare(timeWithWalking, existingLabels[k]) < 0
        ) {
          existingLabels[k] = timeWithWalking;
          improvedLabels = true;
        }
      }
    }

    // The algorithm can be stopped if no label t_k(p) was improved.
    if (!improvedLabels) break;
  }
}

async function getStops(stopIds: readonly Stop['stop_id'][]) {
  const db = await dbReady;
  const { store } = db.transaction('stops');
  batch(stopIds, (stopId) => store.get(stopId));
}
