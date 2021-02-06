import { h, ComponentChild, Fragment } from 'preact';
import { Route } from '@hawaii-bus-plus/types';
import { classNames } from '../../hooks/classnames';
import { colorProps, colorVariables } from '../props';
import './RouteBadge.css';
import { RouteIcon } from '../RouteIcon';

export const BLANK = ' ';

export type RouteBadgeKeys =
  | 'route_id'
  | 'route_color'
  | 'route_short_name'
  | 'route_long_name'
  | 'route_text_color';

interface RouteBadgeProps {
  route?: Pick<Route, RouteBadgeKeys>;
}

export function RouteBadge({ route }: RouteBadgeProps) {
  if (route) {
    return (
      <RouteIcon style={colorVariables(route)} class="route__icon--badge">
        {route.route_short_name}
      </RouteIcon>
    );
  } else {
    return <RouteIcon class="route__icon--badge">...</RouteIcon>;
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
    return clear ? null : <span class="route-link__badges">{BLANK}</span>;
  } else {
    return <span class="route-link__badges">{badges}</span>;
  }
}
