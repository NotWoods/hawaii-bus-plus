import { Repository } from '../../data/repository';
import { Stop, Transfer } from '../../shared/gtfs-types';

export function footPathsLoader(repo: Pick<Repository, 'loadStops'>) {
  const loaded = new Map<Stop['stop_id'], readonly Transfer[]>();

  return (markedStops: Iterable<Stop['stop_id']>) => {
    const toLoad = new Set(markedStops);
    for (const alreadyLoaded of loaded.keys()) {
      toLoad.delete(alreadyLoaded);
    }

    return repo.loadStops(toLoad).then((newStops) => {
      for (const [stopId, stop] of newStops) {
        loaded.set(stopId, stop.transfers);
      }
      return loaded;
    });
  };
}
