import { Route } from '@hawaii-bus-plus/types';

export function RouteName(
  route: Pick<Route, 'route_short_name' | 'route_long_name'>
) {
  return `${route.route_short_name} · ${route.route_long_name}`;
}
