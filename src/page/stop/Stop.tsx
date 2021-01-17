import React, { useContext } from 'react';
import { routes } from '../../mock/api';
import { closeStopAction } from '../router/action';
import { RouterContext } from '../router/Router';
import { RouteSearchItem } from '../sidebar/SearchItems';
import './Stop.css';
import { StreetViewPano } from './StreetViewPano';

export function StopCard() {
  const { stop_id, stop, dispatch } = useContext(RouterContext);

  if (!stop_id) return null;

  return (
    <div className="w-400">
      <aside className="stop card p-0">
        <div className="aspect-ratio-container">
          <StreetViewPano
            className="bg-very-dark aspect-ratio rounded-top"
            position={stop?.position ?? { lat: 19, lng: -150 }}
            visible={Boolean(stop)}
            onClose={() => dispatch(closeStopAction())}
          >
            <img className="rounded-top" alt="Street view" />
          </StreetViewPano>
        </div>
        <div className="content">
          <h2 className="card-title m-0">{stop?.stop_name}</h2>
          <p className="text-muted m-0">{stop?.stop_desc}</p>
        </div>
        <div className="content">
          <h3 className="content-title">Nearby routes</h3>
          <RouteSearchItem className="p-0" route={routes.kona} />
        </div>
      </aside>
    </div>
  );
}
