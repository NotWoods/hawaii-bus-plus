import React from 'react';
import { Route } from '../../shared/gtfs-types';
import { classNames } from '../hooks/classnames';
import { colorProps } from '../routes/props';

interface RouteBadgeProps {
  route?: Route;
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
