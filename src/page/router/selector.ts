import { Route, RouteCore } from '../../shared/gtfs-types';

export function isFullRoute(core: RouteCore): core is Route {
  return 'trips' in core;
}
