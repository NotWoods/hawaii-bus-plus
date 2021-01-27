import { PlacePoint } from '@hawaii-bus-plus/presentation';
import { Route, Stop } from '@hawaii-bus-plus/types';

export type RouterAction =
  | ReturnType<typeof linkAction>
  | ReturnType<typeof setRouteAction>
  | ReturnType<typeof setStopAction>
  | ReturnType<typeof closeRouteAction>
  | ReturnType<typeof closeStopAction>
  | ReturnType<typeof setMarker>
  | ReturnType<typeof openPlace>
  | ReturnType<typeof updateUserLocation>;

export function linkAction(href: string | URL) {
  const url = typeof href === 'string' ? new URL(href) : href;
  return { type: 'link', url } as const;
}

export function setRouteAction(routeId: Route['route_id']) {
  return { type: 'route', routeId } as const;
}

export function setStopAction(stopId: Stop['stop_id']) {
  return { type: 'stop', stopId } as const;
}

export function closeRouteAction() {
  return { type: 'close-route' } as const;
}

export function closeStopAction() {
  return { type: 'close-point' } as const;
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
