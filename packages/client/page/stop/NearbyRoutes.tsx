import { Agency, Route } from '@hawaii-bus-plus/types';
import clsx, { ClassValue } from 'clsx';
import { h } from 'preact';
import { RouteLinkVertical } from '../routes/link/RouteListItem';

interface Props {
  routes: readonly Route[];
  agencies: ReadonlyMap<Agency['agency_id'], Agency>;
  class?: ClassValue;
}

export function NearbyRoutes(props: Props) {
  return (
    <ul
      class={clsx(
        'grid grid-flow-col md:grid-flow-row md:grid-cols-2 gap-4 px-4 snap snap-px-32 overscroll-contain',
        props.class
      )}
    >
      {props.routes.map((route) => (
        <li key={route.route_id}>
          <RouteLinkVertical
            route={route}
            agency={props.agencies.get(route.agency_id)!}
          />
        </li>
      ))}
    </ul>
  );
}
