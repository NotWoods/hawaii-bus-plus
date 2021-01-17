import { Marker } from '@react-google-maps/api';
import React, { useContext } from 'react';
import { useApi } from '../data/Api';
import { setStopAction } from '../router/action';
import { RouterContext } from '../router/Router';

export function StopMarkers() {
  const { dispatch } = useContext(RouterContext);
  const api = useApi();
  const stops = api ? Object.values(api.stops) : [];

  return (
    <>
      {stops.map((stop) => (
        <Marker
          key={stop.stop_id}
          position={stop.position}
          title={stop.stop_name}
          onClick={() => dispatch(setStopAction(stop))}
        />
      ))}
    </>
  );
}
