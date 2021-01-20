import { IDBPDatabase } from 'idb';
import { GTFSSchema } from '../../data/database';
import { batch } from '../../shared/batch';
import { Stop, Transfer } from '../../shared/gtfs-types';

export function footPathsLoader(db: IDBPDatabase<GTFSSchema>) {
  const loaded = new Map<Stop['stop_id'], readonly Transfer[]>();

  return async (markedStops: Iterable<Stop['stop_id']>) => {
    const toLoad = new Set(markedStops);
    for (const alreadyLoaded of loaded.keys()) {
      toLoad.delete(alreadyLoaded);
    }

    const { store } = db.transaction('stops');
    const newStops = await batch(Array.from(toLoad), (stopId) =>
      store.get(stopId)
    );
    for (const [stopId, stop] of newStops) {
      loaded.set(stopId, stop.transfers);
    }
    return loaded;
  };
}
