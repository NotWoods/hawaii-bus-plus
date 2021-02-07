import { Route } from '@hawaii-bus-plus/types';

/**
 * Ditch the opaque type by casting to string.
 */
function simplify(str: string) {
  return str;
}

export function colorVariables(
  route: Pick<Route, 'route_color' | 'route_text_color'>
) {
  return {
    '--route-color': simplify(route.route_color),
    '--route-text-color': simplify(route.route_text_color),
  };
}
