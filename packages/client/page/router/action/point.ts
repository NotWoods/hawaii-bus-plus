import { StationInformation, Stop } from '@hawaii-bus-plus/types';

export type PointRouterAction =
  | ReturnType<typeof setStopAction>
  | ReturnType<typeof setBikeStationAction>
  | ReturnType<typeof closePointAction>
  | ReturnType<typeof setMarker>
  | ReturnType<typeof openPlace>
  | ReturnType<typeof updateUserLocation>;

export function setStopAction(stopId: Stop['stop_id']) {
  return { type: 'stop', stopId } as const;
}

export function setBikeStationAction(
  stationId: StationInformation['station_id'],
  info: StationInformation,
) {
  return {
    type: 'bike-station',
    stationId,
    name: info.name,
    position: info.position,
  } as const;
}

export function closePointAction() {
  return { type: 'close-point' } as const;
}

export function setMarker(location: google.maps.LatLngLiteral) {
  return { type: 'set-marker', location } as const;
}

export function openPlace(
  placeId: string,
  position: google.maps.LatLngLiteral,
) {
  return { type: 'open-place', placeId, position } as const;
}

export function updateUserLocation(
  location: google.maps.LatLngLiteral,
  silent = false,
) {
  return { type: 'update-user-location', location, silent } as const;
}
