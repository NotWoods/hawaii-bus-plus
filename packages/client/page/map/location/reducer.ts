import { LatLng } from 'spherical-geometry-js';
import { ERROR_TYPE, FOUND_TYPE, LocationAction } from './action';
import { GeolocationErrorCode, LocationState } from './state';

export function locationReducer(
  state: LocationState,
  action: LocationAction,
): LocationState {
  switch (action.type) {
    case FOUND_TYPE: {
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
    case ERROR_TYPE:
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
