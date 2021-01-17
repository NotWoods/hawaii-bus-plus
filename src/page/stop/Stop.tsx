import React, { useContext } from 'react';
import { routes } from '../../mock/api';
import { closeStopAction } from '../router/action';
import { RouterContext } from '../router/Router';
import { RouteSearchItem } from '../sidebar/SearchItems';
import { PlaceCard } from './PlaceCard';
import './Stop.css';

export function StopCard() {
  const { stop_id, stop, dispatch } = useContext(RouterContext);

  if (!stop_id) return null;

  return (
    <PlaceCard
      position={stop?.position ?? { lat: 19, lng: -150 }}
      visible={Boolean(stop)}
      onClose={() => dispatch(closeStopAction())}
      title={stop?.stop_name || 'Loading'}
      subtitle={stop?.stop_desc}
    >
      <div className="content">
        <h3 className="content-title">Nearby routes</h3>
        <RouteSearchItem className="p-0" route={routes.kona} />
      </div>
    </PlaceCard>
  );
}
