export interface Coordinates {
  latitude?: number | null;
  longitude?: number | null;
}

export type LocationAction =
  | ReturnType<typeof foundCoordinatesAction>
  | ReturnType<typeof errorAction>;

export function foundCoordinatesAction(coords: Coordinates) {
  return { type: 'found', coords } as const;
}

export function errorAction(error?: GeolocationPositionError) {
  return { type: 'error', error } as const;
}
