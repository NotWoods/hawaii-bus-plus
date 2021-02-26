import { Repository } from '@hawaii-bus-plus/data';
import { Stop, Transfer } from '@hawaii-bus-plus/types';

export type Footpaths = ReadonlyMap<Stop['stop_id'], readonly Transfer[]>;

export function stopsLoader(repo: Pick<Repository, 'loadStops'>) {
  const loaded = new Map<Stop['stop_id'], Stop>();

  function filterLoaded(stops: readonly Stop['stop_id'][]) {
    return new Map(stops.map((id) => [id, loaded.get(id)!]));
  }

  return async (
    stops: readonly Stop['stop_id'][]
  ): Promise<ReadonlyMap<Stop['stop_id'], Stop>> => {
    const toLoad = new Set(stops);
    for (const alreadyLoaded of loaded.keys()) {
      toLoad.delete(alreadyLoaded);
    }

    if (toLoad.size === 0) {
      return filterLoaded(stops);
    }

    const newStops = await repo.loadStops(toLoad);
    for (const [stopId, stop] of newStops) {
      loaded.set(stopId, stop);
    }

    return filterLoaded(stops);
  };
}
