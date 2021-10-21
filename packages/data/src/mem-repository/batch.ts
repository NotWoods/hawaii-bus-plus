import { GTFSData } from '@hawaii-bus-plus/types';

export function memoryBatch<
  Id extends string,
  Name extends 'routes' | 'agency' | 'stops',
>(record: Name, api: GTFSData, ids: Iterable<Id>) {
  const uniq = new Set(ids);
  return new Map(Array.from(uniq, (id) => [id, api[record][id]]));
}
