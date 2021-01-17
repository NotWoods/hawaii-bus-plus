import React from 'react';

interface RouteBadgeProps {
  route_short_name: string;
  route_long_name?: string;
}

export function RouteBadge(props: RouteBadgeProps) {
  return (
    <span className="badge" title={props.route_long_name}>
      {props.route_short_name}
    </span>
  );
}
