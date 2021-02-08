import { h, Fragment } from 'preact';
import type { StopDetails } from '../../worker-info/stop-details';
import { PlaceResult } from '../router/reducer';
import { RouteListItem } from '../routes/link/RouteListItem';
import { StopSearchItem } from '../sidebar/SearchItems';

export function StopInfo({ stop }: { stop?: StopDetails }) {
  const transfers = stop?.transfers ?? [];
  return (
    <>
      <div className="p-4">
        <h2 className="card-title font-display text-2xl">{stop?.stop_name ?? 'Loading'}</h2>
        <p className="text-muted m-0">{stop?.stop_desc}</p>
      </div>
      <div className="p-4">
        <h3 className="font-display text-xl">Nearby routes</h3>
        {stop?.routes?.map((route) => (
          <RouteListItem
            key={route.route_id}
            className="px-0"
            route={route}
            agency={stop.agencies.get(route.agency_id)!}
          />
        ))}
      </div>
      {transfers.length > 0 && (
        <div className="p-4">
          <h3 className="font-display text-xl">Adjacent stops</h3>
          {stop?.transfers?.map((transfer) => (
            <StopSearchItem
              key={transfer.toStop.stop_id}
              className="px-0"
              stopId={transfer.toStop.stop_id}
              stopName={transfer.toStop.stop_name}
              stopDesc={transfer.toStop.stop_desc}
            />
          ))}
        </div>
      )}
    </>
  );
}

export function PlaceInfo({ place }: { place?: PlaceResult }) {
  return (
    <>
      <div className="content">
        <h2 className="card-title font-display m-0">{place?.name ?? 'Loading'}</h2>
        <p className="text-muted m-0">{place?.formatted_address}</p>
      </div>
    </>
  );
}
