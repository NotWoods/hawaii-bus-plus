import { IDBPDatabase } from 'idb';
import { Stop } from '../../shared/gtfs-types';
import { batch } from '../../shared/batch';
import { GTFSSchema } from '../database';
import { removeWords } from '../format';

export function loadStops(
  db: IDBPDatabase<GTFSSchema>,
  stopIds: Iterable<Stop['stop_id']>
) {
  const { store } = db.transaction('stops');
  return batch(Array.from(stopIds), (stopId) => store.get(stopId));
}

/** Approximate 5 kilometers to latitude longitude offset */
const FIVE_KM_LAT_LNG = 0.05;

export function loadStopsSpatial(
  db: IDBPDatabase<GTFSSchema>,
  center: google.maps.LatLngLiteral
) {
  const latKeyRange = IDBKeyRange.bound(
    center.lat - FIVE_KM_LAT_LNG,
    center.lat + FIVE_KM_LAT_LNG
  );
  const lngKeyRange = IDBKeyRange.bound(
    center.lng - FIVE_KM_LAT_LNG,
    center.lng + FIVE_KM_LAT_LNG
  );

  const { store } = db.transaction('stops');
  return Promise.all([
    // First, split on longitude
    store.index('stop_lon').getAllKeys(lngKeyRange),
    store.index('stop_lat').getAll(latKeyRange),
  ]).then(([lngKeysArray, latValues]) => {
    const lngKeys = new Set(lngKeysArray);
    return latValues
      .filter((stop) => lngKeys.has(stop.stop_id))
      .map(removeWords);
  });
}
