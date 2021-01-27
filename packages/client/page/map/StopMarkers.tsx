import { Stop } from '@hawaii-bus-plus/types';
import { Marker } from '@react-google-maps/api';
import React, { useContext } from 'react';
import { useApi } from '../data/Api';
import { setStopAction } from '../router/action';
import { RouterContext } from '../router/Router';

const highlightedStop = {
  url: '/pins.png',
  size: { height: 26, width: 24 },
  scaledSize: { height: 26, width: 120 },
  origin: { x: 0, y: 0 },
  anchor: { x: 12, y: 12 },
} as google.maps.Icon;

const otherStop = {
  url: '/pins.png',
  size: { height: 26, width: 24 },
  scaledSize: { height: 26, width: 120 },
  origin: { x: 96, y: 0 },
  anchor: { x: 12, y: 12 },
} as google.maps.Icon;

const selectedStop = {
  url: '/pins.png',
  size: { height: 26, width: 24 },
  scaledSize: { height: 26, width: 120 },
  origin: { x: 24, y: 0 },
  anchor: { x: 12, y: 20 },
} as google.maps.Icon;

interface Props {
  highlighted?: ReadonlySet<Stop['stop_id']>;
}

export function StopMarkers(props: Props) {
  const { dispatch, stop_id } = useContext(RouterContext);
  const api = useApi();
  const stops = api?.stops || [];

  return (
    <>
      {stops.map((stop) => {
        const selected = stop.stop_id === stop_id;
        return (
          <Marker
            key={stop.stop_id}
            position={stop.position}
            icon={
              selected
                ? selectedStop
                : props.highlighted?.has(stop.stop_id)
                ? highlightedStop
                : otherStop
            }
            title={selected ? `(Selected) ${stop.stop_name}` : stop.stop_name}
            onClick={() => dispatch(setStopAction(stop.stop_id))}
          />
        );
      })}
    </>
  );
}
