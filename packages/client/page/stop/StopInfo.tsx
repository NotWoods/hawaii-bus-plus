import { h, Fragment } from 'preact';
import type { StopDetails } from '../../worker-info/stop-details';
import { StopSearchResultItem } from '../search/items/MarkerSearchResultItem';
import { NearbyRoutes } from './NearbyRoutes';
import { PointDescription } from './PointInfo';

export function StopInfo({ stop }: { stop: StopDetails }) {
  return (
    <>
      <PointDescription>{stop.stop_desc}</PointDescription>
      {stop.transfers.length > 0 && (
        <>
          <h3 className="font-display text-lg m-4 mb-0">Adjacent stops</h3>
          <ul class="px-4 py-2">
            {stop?.transfers?.map((transfer) => (
              <StopSearchResultItem
                key={transfer.toStop.stop_id}
                stopId={transfer.toStop.stop_id}
                stopName={transfer.toStop.stop_name}
                stopDesc={transfer.toStop.stop_desc}
              />
            ))}
          </ul>
        </>
      )}
      <h3 className="font-display text-lg m-4 mb-1">Connected routes</h3>
      <NearbyRoutes routes={stop.routes} agencies={stop?.agencies} />
    </>
  );
}
