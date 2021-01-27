import React, { ReactNode } from 'react';
import { Route } from '@hawaii-bus-plus/types';
import { classNames } from '../hooks/classnames';
import { colorProps } from '../routes/props';

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
    const { backgroundColor, dark } = colorProps(route);
    return (
      <span
        className={classNames('badge', dark ? 'text-dark' : 'text-white')}
        title={route.route_long_name}
        style={{ backgroundColor }}
      >
        {route.route_short_name}
      </span>
    );
  } else {
    return <span className="badge">...</span>;
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
  const badges: ReactNode[] = [];
  for (const route of routes || []) {
    if (route.route_id !== omit) {
      badges.push(<RouteBadge key={route.route_id} route={route} />);
      badges.push(' ');
    }
  }
  badges.pop();

  if (badges.length === 0) {
    return clear ? null : <>{BLANK}</>;
  } else {
    return <>{badges}</>;
  }
}
