import { Route, Stop } from '@hawaii-bus-plus/types';
import { PlaceResult } from './reducer';

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
  return { type: 'close-stop' } as const;
}

export function setMarker(location: google.maps.LatLngLiteral) {
  return { type: 'set-marker', location } as const;
}

export function openPlace(place: PlaceResult) {
  return { type: 'open-place', place } as const;
}

export function updateUserLocation(
  location: google.maps.LatLngLiteral,
  silent = false
) {
  return { type: 'update-user-location', location, silent } as const;
}
