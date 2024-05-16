import type { Route } from '@hawaii-bus-plus/types';

import { SmallRouteIcon } from '../../../../components/RouteIcon/RouteIcon';
import { colorVariables } from '../../../../components/route-colors';

export const BLANK = ' ';

export type RouteBadgeKeys =
  | 'route_id'
  | 'route_color'
  | 'route_short_name'
  | 'route_long_name'
  | 'route_text_color';

interface RouteBadgeProps {
  route?: Pick<Route, RouteBadgeKeys>;
  class?: string;
}

export function RouteBadge(props: RouteBadgeProps) {
  const { route } = props;
  if (route) {
    return (
      <SmallRouteIcon
        style={colorVariables(route)}
        title={route.route_long_name}
        class={props.class}
      >
        {route.route_short_name}
      </SmallRouteIcon>
    );
  } else {
    return <SmallRouteIcon>...</SmallRouteIcon>;
  }
}

interface RouteBadgesProps {
  routes?: readonly Pick<Route, RouteBadgeKeys>[];
  omit?: Route['route_id'];
  clear?: boolean;
}

/**
 * Displays a list of badges representing routes that a stop connects to.
 */
export function RouteBadges({ routes, omit, clear }: RouteBadgesProps) {
  const badges = routes
    ?.filter((route) => route.route_id !== omit)
    ?.map((route) => <RouteBadge key={route.route_id} route={route} />);

  if (!badges || badges.length === 0) {
    return clear ? null : <span class="flex gap-1">{BLANK}</span>;
  } else {
    return <span class="flex gap-1 flex-wrap">{badges}</span>;
  }
}
