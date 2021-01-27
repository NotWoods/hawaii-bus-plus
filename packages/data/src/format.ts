import { Trip, TripWithoutTimes } from '@hawaii-bus-plus/types';

export function removeWords<T extends { words: readonly string[] }>(
  value: T
): Omit<T, 'words'> {
  const result = value as Omit<T, 'words'> & Partial<T>;
  delete result.words;
  return result;
}

export function omitStopTimes(trip: Trip): TripWithoutTimes {
  const { stop_times, ...rest } = trip;
  return rest;
}

export function unique<In>(items: Iterable<In>): In[];
export function unique<In, Out>(
  items: Iterable<In>,
  mapFn: (v: In, k: number) => Out
): Out[];
export function unique<In, Out>(
  items: Iterable<In>,
  mapFn?: (v: In, k: number) => Out
): Out[] {
  return Array.from(new Set(items), mapFn as any);
}
