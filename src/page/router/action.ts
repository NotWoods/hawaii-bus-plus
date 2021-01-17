import { Route, Stop } from '../../shared/gtfs-types';

export function linkAction(href: string | URL) {
  const url = typeof href === 'string' ? new URL(href) : href;
  return { type: 'link', url } as const;
}

export function setRouteAction(route: Route) {
  return { type: 'route', route, href: `/routes/${route.route_id}/` } as const;
}

export function setStopAction(stop: Stop) {
  return { type: 'stop', stop, href: `?stop=${stop.stop_id}` } as const;
}

export function closeStopAction() {
  return { type: 'close-stop' } as const;
}
