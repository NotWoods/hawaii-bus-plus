import { Agency, Route } from '@hawaii-bus-plus/types';
import { h } from 'preact';
import { classNames } from '../hooks/classnames';
import { RouteLinkVertical } from '../routes/link/RouteListItem';

interface Props {
  routes: readonly Route[];
  agencies: ReadonlyMap<Agency['agency_id'], Agency>;
  class?: string;
}

export function NearbyRoutes(props: Props) {
  return (
    <ul
      class={classNames(
        'grid grid-flow-col md:grid-flow-row md:grid-cols-2 gap-4 overflow-auto px-4 scroll-snap scroll-px-8 overscroll-contain',
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
