import { Marker } from '@react-google-maps/api';
import React, { useContext } from 'react';
import { RouterContext } from '../router/Router';

export function PlaceMarker() {
  const { place, place_id, marker } = useContext(RouterContext);

  const position = place?.location || marker;
  if (!position) return null;

  return (
    <Marker
      position={position}
      title={place?.name || `Selected place ${place_id}`}
    />
  );
}
