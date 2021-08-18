import { Coordinates } from './ipstack';

export type LocationAction =
  | ReturnType<typeof foundCoordinatesAction>
  | ReturnType<typeof errorAction>;

export const FOUND_TYPE = Symbol('found');
export const ERROR_TYPE = Symbol('error');

export function foundCoordinatesAction(coords: Coordinates) {
  return { type: FOUND_TYPE, coords } as const;
}

export function errorAction(error?: GeolocationPositionError) {
  return { type: ERROR_TYPE, error } as const;
}
