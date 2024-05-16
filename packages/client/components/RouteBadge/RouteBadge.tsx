import type { Route } from '@hawaii-bus-plus/types';

import { SmallRouteIcon } from '../RouteIcon/RouteIcon';
import { colorVariables } from '../route-colors';

export type RouteBadgeKeys =
  | 'route_id'
  | 'route_color'
  | 'route_short_name'
  | 'route_long_name'
  | 'route_text_color';

interface Props {
  route?: Pick<Route, RouteBadgeKeys>;
  class?: string;
}

export function RouteBadge({ route, class: className }: Props) {
  if (route) {
    return (
      <SmallRouteIcon
        style={colorVariables(route)}
        title={route.route_long_name}
        class={className}
      >
        {route.route_short_name}
      </SmallRouteIcon>
    );
  } else {
    return <SmallRouteIcon>...</SmallRouteIcon>;
  }
}
