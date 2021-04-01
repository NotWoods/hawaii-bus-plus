import { Route } from '@hawaii-bus-plus/types';
import { h } from 'preact';
import { RouteIcon } from '../../all-pages/components/RouteIcon';

interface Props {
  route: Route;
}

export function ShareHeader(props: Props) {
  return (
    <header>
      <div>
        <RouteIcon>{props.route.route_short_name}</RouteIcon>
        <h2 class="font-display text-3xl">{props.route.route_long_name}</h2>
      </div>
    </header>
  );
}
