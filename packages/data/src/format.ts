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
