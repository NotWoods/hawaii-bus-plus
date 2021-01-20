import { IDBPDatabase } from 'idb';
import { computeDistanceBetween } from 'spherical-geometry-js';
import { GTFSSchema } from '../data/database';
import { removeWords } from '../data/format';
import { Stop } from '../shared/gtfs-types';
import { compareAs } from '../shared/utils/sort';

/** Approximate 5 kilometers to latitude longitude offset */
const FIVE_KM_LAT_LNG = 0.05;

export interface StopWithDistance extends Stop {
  distance: number;
}

/**
 * Returns at most 5 stops near the given location.
 */
export async function findClosestStops(
  db: IDBPDatabase<GTFSSchema>,
  location: google.maps.LatLngLiteral
) {
  const latKeyRange = IDBKeyRange.bound(
    location.lat - FIVE_KM_LAT_LNG,
    location.lat + FIVE_KM_LAT_LNG
  );
  const lngKeyRange = IDBKeyRange.bound(
    location.lng - FIVE_KM_LAT_LNG,
    location.lng + FIVE_KM_LAT_LNG
  );

  // First, split on longitude
  const lngKeys = new Set(
    await db.getAllKeysFromIndex('stops', 'stop_lon', lngKeyRange)
  );
  const latValues = await db.getAllFromIndex('stops', 'stop_lat', latKeyRange);

  return latValues
    .filter((stop) => lngKeys.has(stop.stop_id))
    .map((searchStop) => {
      const stopWithDist = removeWords(searchStop) as StopWithDistance;
      stopWithDist.distance = computeDistanceBetween(
        searchStop.position,
        location
      );
      return stopWithDist;
    })
    .filter((stop) => stop.distance < 5_000)
    .sort(compareAs((stop) => stop.distance))
    .slice(0, 5);
}
