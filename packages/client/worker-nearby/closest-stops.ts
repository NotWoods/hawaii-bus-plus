import { computeDistanceBetween } from 'spherical-geometry-js';
import { Repository } from '../data/repository';
import { Stop } from '../shared/gtfs-types';
import { compareAs } from '../shared/utils/sort';

export interface StopWithDistance extends Stop {
  distance: number;
}

/**
 * Returns at most 5 stops near the given location.
 */
export async function findClosestStops(
  repo: Pick<Repository, 'loadStopsSpatial'>,
  location: google.maps.LatLngLiteral
) {
  return repo.loadStopsSpatial(location).then((stops) => {
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
  });
}
