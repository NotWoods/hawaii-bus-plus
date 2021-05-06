import { StationInformation, Stop } from '@hawaii-bus-plus/types';

export type PointRouterAction =
  | ReturnType<typeof setStopAction>
  | ReturnType<typeof setBikeStationAction>
  | ReturnType<typeof closePointAction>
  | ReturnType<typeof setMarker>
  | ReturnType<typeof openPlace>
  | ReturnType<typeof updateUserLocation>;

export const SET_STOP_TYPE = Symbol('stop');
export const SET_BIKE_STATION_TYPE = Symbol('bike-station');
export const SET_MARKER_TYPE = Symbol('set-marker');
export const OPEN_PLACE_TYPE = Symbol('open-place');
export const UPDATE_USER_LOCATION_TYPE = Symbol('user-location');
export const CLOSE_POINT_TYPE = Symbol('close-point');

export function setStopAction(stopId: Stop['stop_id']) {
  return { type: SET_STOP_TYPE, stopId } as const;
}

export function setBikeStationAction(
  stationId: StationInformation['station_id'],
  info: StationInformation,
) {
  return {
    type: SET_BIKE_STATION_TYPE,
    stationId,
    name: info.name,
    position: info.position,
  } as const;
}

export function closePointAction() {
  return { type: CLOSE_POINT_TYPE } as const;
}

export function setMarker(location: google.maps.LatLngLiteral) {
  return { type: SET_MARKER_TYPE, location } as const;
}

export function openPlace(
  placeId: string,
  position: google.maps.LatLngLiteral,
) {
  return { type: OPEN_PLACE_TYPE, placeId, position } as const;
}

export function updateUserLocation(
  location: google.maps.LatLngLiteral,
  silent = false,
) {
  return { type: UPDATE_USER_LOCATION_TYPE, location, silent } as const;
}
