import { Route } from '../../shared/gtfs-types';

export function colorProps(
  route: Pick<Route, 'route_color' | 'route_text_color'>
) {
  return {
    backgroundColor: `#${route.route_color}`,
    dark: route.route_text_color === '000000',
  };
}
