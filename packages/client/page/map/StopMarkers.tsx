import { Marker } from '@react-google-maps/api';
import React, { useContext } from 'react';
import { useApi } from '../data/Api';
import { setStopAction } from '../router/action';
import { RouterContext } from '../router/Router';

export function StopMarkers() {
  const { dispatch, stop_id } = useContext(RouterContext);
  const api = useApi();
  const stops = api ? Object.values(api.stops) : [];

  return (
    <>
      {stops.map((stop) => {
        const selected = stop.stop_id === stop_id;
        return (
          <Marker
            key={stop.stop_id}
            position={stop.position}
            title={selected ? `(Selected) ${stop.stop_name}` : stop.stop_name}
            onClick={() => dispatch(setStopAction(stop))}
          />
        );
      })}
    </>
  );
}
