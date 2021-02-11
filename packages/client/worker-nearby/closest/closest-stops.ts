import { computeDistanceBetween } from 'spherical-geometry-js';
import { Repository } from '@hawaii-bus-plus/data';
import { Stop } from '@hawaii-bus-plus/types';
import { compareAs } from '@hawaii-bus-plus/utils';

export interface StopWithDistance extends Stop {
  distance: number;
}

/**
 * Returns at most 5 stops near the given location.
 */
export async function findClosestStops(
  repo: Pick<Repository, 'loadStopsSpatial'>,
  location: google.maps.LatLngLiteral
): Promise<StopWithDistance[]> {
  const stops = await repo.loadStopsSpatial(location);
  return stops
    .map((stop) => {
      return {
        ...stop,
        distance: computeDistanceBetween(stop.position, location),
      };
    })
    .filter((stop) => stop.distance < 5_000)
    .sort(compareAs((stop) => stop.distance))
    .slice(0, 5);
}
