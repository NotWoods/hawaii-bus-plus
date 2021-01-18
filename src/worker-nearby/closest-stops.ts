import { computeDistanceBetween } from 'spherical-geometry-js';
import { dbReady } from '../data/database';
import { compareAs } from '../shared/utils/sort';

/** Approximate 5 kilometers to latitude longitude offset */
const FIVE_KM_LAT_LNG = 0.05;

/**
 * Returns at most 5 stops near the given location.
 */
export async function findClosestStops(location: google.maps.LatLngLiteral) {
  const db = await dbReady;

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
    .sort(compareAs((stop) => computeDistanceBetween(stop.position, location)))
    .slice(0, 5);
}
