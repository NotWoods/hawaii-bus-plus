export interface Coordinates {
  latitude?: number | null;
  longitude?: number | null;
}

export type GeolocationErrorCode = typeof GeolocationErrorCode[keyof typeof GeolocationErrorCode];
export const GeolocationErrorCode = {
  NOT_YET_LOADED: -1,
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3,
} as const;

export type LocationAction =
  | ReturnType<typeof foundCoordinatesAction>
  | ReturnType<typeof errorAction>;

export function foundCoordinatesAction(coords: Coordinates) {
  return { type: 'found', coords } as const;
}

export function errorAction(error?: GeolocationPositionError) {
  return { type: 'error', error } as const;
}
