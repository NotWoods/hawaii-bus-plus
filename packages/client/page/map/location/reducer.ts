import { LatLng } from 'spherical-geometry-js';
import { GeolocationErrorCode } from '../../hooks';
import { LocationAction } from './action';

interface LocationState {
  error?: GeolocationErrorCode;
  coords?: google.maps.LatLngLiteral;
}

export function locationReducer(
  state: LocationState,
  action: LocationAction,
): LocationState {
  switch (action.type) {
    case 'found': {
      const { coords } = action;
      if (coords.latitude != undefined && coords.longitude != undefined) {
        const latLng = new LatLng(coords.latitude, coords.longitude);
        return {
          error: undefined,
          coords: {
            lat: latLng.lat(),
            lng: latLng.lng(),
          },
        };
      } else {
        return {
          coords: state.coords,
          error: GeolocationErrorCode.POSITION_UNAVAILABLE,
        };
      }
    }
    case 'error':
      if (action.error) {
        return {
          coords: state.coords,
          error: action.error.code as GeolocationErrorCode,
        };
      } else {
        return state;
      }
  }
}
