import type { Repository } from '@hawaii-bus-plus/data';
import type { Stop } from '@hawaii-bus-plus/types';
import { compareAs } from '@hawaii-bus-plus/utils';
import {
  computeDistanceBetween,
  type LatLngLiteral,
} from 'spherical-geometry-js';

export interface StopWithDistance extends Stop {
  distance: number;
}

/**
 * Returns at most 5 stops near the given location.
 */
export async function findClosestStops(
  repo: Pick<Repository, 'loadStopsSpatial'>,
  location: LatLngLiteral,
): Promise<StopWithDistance[]> {
  const stops = await repo.loadStopsSpatial(location);
  return stops
    .map((stop) =>
      Object.assign({}, stop, {
        distance: computeDistanceBetween(stop.position, location),
      }),
    )
    .filter((stop) => stop.distance < 5_000)
    .sort(compareAs((stop) => stop.distance))
    .slice(0, 5);
}
