import { PlacePoint, Point } from '@hawaii-bus-plus/presentation';
import { Route, StationInformation, Stop } from '@hawaii-bus-plus/types';
import type { Journey } from '../../worker-nearby/directions/format';

export type RouterAction =
  | ReturnType<typeof linkAction>
  | ReturnType<typeof setRouteAction>
  | ReturnType<typeof setStopAction>
  | ReturnType<typeof setBikeStationAction>
  | ReturnType<typeof closeRouteAction>
  | ReturnType<typeof closeStopAction>
  | ReturnType<typeof closeJourneyAction>
  | ReturnType<typeof setMarker>
  | ReturnType<typeof openPlace>
  | ReturnType<typeof updateUserLocation>
  | ReturnType<typeof openJourney>;

export function linkAction(href: string | URL) {
  const url = typeof href === 'string' ? new URL(href) : href;
  return { type: 'link', url } as const;
}

export function setRouteAction(
  routeId: Route['route_id']
): { type: 'route'; routeId: Route['route_id'] } {
  return { type: 'route', routeId };
}

export function setStopAction(
  stopId: Stop['stop_id']
): { type: 'stop'; stopId: Stop['stop_id'] } {
  return { type: 'stop', stopId };
}

export function setBikeStationAction(
  stationId: StationInformation['station_id'],
  info: StationInformation
): {
  type: 'bike-station';
  stationId: StationInformation['station_id'];
  name: string;
  position: google.maps.LatLngLiteral;
} {
  return {
    type: 'bike-station',
    stationId,
    name: info.name,
    position: info.position,
  };
}

export function closeRouteAction() {
  return { type: 'close-route' } as const;
}

export function closeStopAction() {
  return { type: 'close-point' } as const;
}

export function closeJourneyAction() {
  return { type: 'close-journey' } as const;
}

export function setMarker(location: google.maps.LatLngLiteral) {
  return { type: 'set-marker', location } as const;
}

export function openPlace(
  placeId: string,
  position: google.maps.LatLngLiteral
) {
  const point: PlacePoint = { type: 'place', placeId, position };
  return { type: 'open-place', point } as const;
}

export function updateUserLocation(
  location: google.maps.LatLngLiteral,
  silent = false
) {
  return { type: 'update-user-location', location, silent } as const;
}

export function openJourney(
  depart: Point,
  arrive: Point,
  departureTime: string,
  journey: Journey
) {
  return {
    type: 'open-journey',
    depart,
    arrive,
    departureTime,
    journey,
  } as const;
}
