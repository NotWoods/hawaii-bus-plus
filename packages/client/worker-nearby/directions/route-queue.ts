import {
  DirectionRoute,
  DirectionsData,
  Stop,
  StopRouteInfo,
} from '@hawaii-bus-plus/types';

export interface QueueValue {
  stop_id: Stop['stop_id'];
  info: StopRouteInfo;
}

/**
 * Construct queue Q for RAPTOR from the marked stops in the previous round.
 * Returns a map of routes that the given stops connect to.
 * Values represent the earliest marked stop in the route.
 */
export function buildQueue(
  data: Pick<DirectionsData, 'stops'>,
  markedStops: Iterable<Stop['stop_id']>
): Map<DirectionRoute['id'], QueueValue> {
  const queue = new Map<DirectionRoute['id'], QueueValue>();
  for (const stopId of markedStops) {
    for (const routeInfo of data.stops[stopId]?.routes || []) {
      const existingStop = queue.get(routeInfo.route_id);
      if (!existingStop || routeInfo.sequence < existingStop.info.sequence) {
        queue.set(routeInfo.route_id, { stop_id: stopId, info: routeInfo });
      }
    }
  }
  return queue;
}
