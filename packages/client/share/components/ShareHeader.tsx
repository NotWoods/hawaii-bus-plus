import { Route } from '@hawaii-bus-plus/types';
import { h } from 'preact';
import { RouteIcon } from '../../all-pages/components/RouteIcon';

interface Props {
  route: Route;
}

export function ShareHeader(props: Props) {
  return (
    <header class="grid-area-header flex flex-col md:flex-row gap-x-4 gap-y-2 md:items-center px-4 py-2 md:pb-0 border-b">
      <RouteIcon>{props.route.route_short_name}</RouteIcon>
      <h2 class="font-display text-3xl">{props.route.route_long_name}</h2>
    </header>
  );
}
