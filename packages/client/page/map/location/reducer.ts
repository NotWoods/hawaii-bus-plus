import { LatLng } from 'spherical-geometry-js';
import { ERROR_TYPE, FOUND_TYPE, type LocationAction } from './action';
import { GeolocationErrorCode, type LocationState } from './state';

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
          coords: latLng.toJSON(),
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
