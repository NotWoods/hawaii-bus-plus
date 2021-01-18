import React, { useContext } from 'react';
import { center } from '../../react-google-maps';
import { useApi } from '../data/Api';
import { closeStopAction } from '../router/action';
import { RouterContext } from '../router/Router';
import { RouteSearchItem } from '../sidebar/SearchItems';
import { PlaceCard } from './PlaceCard';

export function StopCard() {
  const { stop_id, stop: stopData, dispatch } = useContext(RouterContext);
  const api = useApi();

  if (!stop_id) return null;

  const stop = stopData || api?.stops?.[stop_id];
  const nearbyRoutes = stop?.routes || [];

  return (
    <PlaceCard
      position={stop?.position ?? center}
      visible={Boolean(stop)}
      onClose={() => dispatch(closeStopAction())}
      title={stop?.stop_name || 'Loading'}
      subtitle={stop?.stop_desc}
    >
      <div className="content">
        <h3 className="content-title">Nearby routes</h3>
        {nearbyRoutes.map((routeId) => (
          <RouteSearchItem key={routeId} className="px-0" routeId={routeId} />
        ))}
      </div>
    </PlaceCard>
  );
}
