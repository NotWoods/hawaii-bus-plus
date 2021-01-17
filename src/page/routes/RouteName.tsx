import React from 'react';
import { Route } from '../../shared/gtfs-types';

interface Props {
  route: Pick<Route, 'route_short_name' | 'route_long_name'>;
}

export function RouteName({ route }: Props) {
  return (
    <>
      {route.route_short_name} · {route.route_long_name}
    </>
  );
}
