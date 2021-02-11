import { Agency, Route, Stop } from '@hawaii-bus-plus/types';
import { ComponentChildren, h, Fragment } from 'preact';
import { StopSearchResultItem } from '../search/items/MarkerSearchResultItem';
import { NearbyRoutes } from './NearbyRoutes';

interface Props {
  children?: ComponentChildren;
}

export function PointHeader({ children }: Props) {
  return (
    <h2 class="font-display font-medium text-xl mx-4">
      {children ?? 'Loading'}
    </h2>
  );
}

export function PointDescription({ children }: Props) {
  return <p class="opacity-80 mx-4">{children}</p>;
}

interface InfoProps {
  stops: readonly Stop[];
  routes: ReadonlyMap<Route['route_id'], Route>;
  agencies: ReadonlyMap<Agency['agency_id'], Agency>;
  stopsTitle: ComponentChildren;
  routesTitle: ComponentChildren;
}

export function PointInfo(props: InfoProps) {
  return (
    <>
      {props.stops.length > 0 && (
        <>
          <h3 className="font-display text-lg m-4 mb-0">{props.stopsTitle}</h3>
          <ul class="px-4 py-2">
            {props.stops.map((stop) => (
              <StopSearchResultItem
                key={stop.stop_id}
                stopId={stop.stop_id}
                stopName={stop.stop_name}
                stopDesc={stop.stop_desc}
                routes={stop.routes.map((id) => props.routes.get(id)!)}
              />
            ))}
          </ul>
        </>
      )}
      <h3 className="font-display text-lg m-4 mb-1">{props.routesTitle}</h3>
      <NearbyRoutes
        routes={Array.from(props.routes.values())}
        agencies={props.agencies}
      />
    </>
  );
}
