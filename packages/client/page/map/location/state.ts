export type GeolocationErrorCode = typeof GeolocationErrorCode[keyof typeof GeolocationErrorCode];
export const GeolocationErrorCode = {
  NOT_YET_LOADED: -1,
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3,
} as const;

export interface LocationState {
  error?: GeolocationErrorCode;
  coords?: google.maps.LatLngLiteral;
}
