import { h, Fragment } from 'preact';
import type { StopDetails } from '../../worker-info/stop-details';
import { PlaceResult } from '../router/reducer';
import { RouteSearchItem, StopSearchItem } from '../sidebar/SearchItems';

export function StopInfo({ stop }: { stop?: StopDetails }) {
  const transfers = stop?.transfers || [];
  return (
    <>
      <div className="content">
        <h2 className="card-title m-0">{stop?.stop_name || 'Loading'}</h2>
        <p className="text-muted m-0">{stop?.stop_desc}</p>
      </div>
      <div className="content">
        <h3 className="content-title">Nearby routes</h3>
        {stop?.routes?.map((route) => (
          <RouteSearchItem
            key={route.route_id}
            className="px-0"
            routeId={route.route_id}
            route={route}
          />
        ))}
      </div>
      {transfers.length > 0 && (
        <div className="content">
          <h3 className="content-title">Adjacent stops</h3>
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
        <h2 className="card-title m-0">{place?.name || 'Loading'}</h2>
        <p className="text-muted m-0">{place?.formatted_address}</p>
      </div>
    </>
  );
}
