import { Mutable } from 'type-fest';
import { Route, RouteWithTrips } from '@hawaii-bus-plus/types';

export function removeWords<T extends { words: readonly string[] }>(
  value: T
): Omit<T, 'words'> {
  const result = value as Omit<T, 'words'> & Partial<T>;
  delete result.words;
  return result;
}

export function removeTrips(route: RouteWithTrips): Route {
  const result = route as Route & Partial<Mutable<RouteWithTrips>>;
  delete result.trips;
  return result;
}
