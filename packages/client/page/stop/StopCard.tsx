import React, { useContext } from 'react';
import { center, googleMapsApiKey } from '@hawaii-bus-plus/react-google-maps';
import { Route, Stop } from '@hawaii-bus-plus/types';
import InfoWorker from '../../worker-info/info?worker';
import { useApi } from '../data/Api';
import { usePromise } from '../hooks/usePromise';
import { useWorker } from '../hooks/useWorker';
import { closeStopAction, openPlace, setStopAction } from '../router/action';
import { PlaceResult } from '../router/reducer';
import { RouterContext } from '../router/Router';
import { RouteSearchItem } from '../sidebar/SearchItems';
import { sessionToken } from '../sidebar/SidebarSearch';
import { PlaceCard } from './PlaceCard';

export function StopCard() {
  const state = useContext(RouterContext);
  const { focus, stop_id, stop, place_id, place, dispatch } = state;

  const worker = useWorker(InfoWorker)!;

  function onClose() {
    dispatch(closeStopAction());
  }

  usePromise(
    async function getDetails() {
      switch (focus) {
        case 'stop':
        case 'place':
          if (!state[focus]) {
            const result = await worker.postMessage({
              type: state[focus],
              id: focus === 'stop' ? stop_id : place_id,
              key: googleMapsApiKey,
              sessionToken,
            });
            console.log(result);

            dispatch(
              focus === 'stop'
                ? setStopAction(result as Stop)
                : openPlace(result as google.maps.places.PlaceResult)
            );
          }
          return;
      }
    },
    [focus, stop_id, place_id]
  );

  switch (focus) {
    case 'stop':
      return (
        <PlaceCard
          position={stop?.position ?? center}
          visible={Boolean(stop)}
          onClose={onClose}
        >
          <StopInfo stop={stop} />
        </PlaceCard>
      );
    case 'place':
      return (
        <PlaceCard
          position={stop?.position ?? center}
          visible={Boolean(place)}
          onClose={onClose}
        >
          <PlaceInfo place={place} />
        </PlaceCard>
      );
    case 'user':
    case 'marker':
      return <PlaceCard position={state[focus]!} visible onClose={onClose} />;
    case undefined:
      return null;
  }
}

export function StopInfo({ stop }: { stop?: Stop }) {
  const api = useApi();
  const nearbyRoutes = stop?.routes || [];
  const loadedRoutes = api
    ? new Map(nearbyRoutes.map((routeId) => [routeId, api.routes[routeId]]))
    : new Map<Route['route_id'], Route>();

  return (
    <>
      <div className="content">
        <h2 className="card-title m-0">{stop?.stop_name || 'Loading'}</h2>
        <p className="text-muted m-0">{stop?.stop_desc}</p>
      </div>
      <div className="content">
        <h3 className="content-title">Nearby routes</h3>
        {nearbyRoutes.map((routeId) => (
          <RouteSearchItem
            key={routeId}
            className="px-0"
            routeId={routeId}
            route={loadedRoutes.get(routeId)}
          />
        ))}
      </div>
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
