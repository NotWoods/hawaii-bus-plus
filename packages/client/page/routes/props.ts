import { Route } from '@hawaii-bus-plus/types';

export function colorProps(
  route: Pick<Route, 'route_color' | 'route_text_color'>
) {
  return {
    backgroundColor: `#${route.route_color}`,
    dark: route.route_text_color === '000000',
  };
}
