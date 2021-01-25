import { Marker } from '@react-google-maps/api';
import React, { useContext } from 'react';
import { convertLatLng } from 'spherical-geometry-js';
import { RouterContext } from '../router/Router';

const placeIcon = {
  url: '/pins.png',
  size: { height: 26, width: 24 },
  scaledSize: { height: 26, width: 120 },
  origin: { x: 72, y: 0 },
  anchor: { x: 12, y: 12 },
} as google.maps.Icon;

const userIcon = {
  url: '/pins.png',
  size: { height: 26, width: 24 },
  scaledSize: { height: 26, width: 120 },
  origin: { x: 48, y: 0 },
  anchor: { x: 12, y: 23 },
} as google.maps.Icon;

export function PlaceMarker() {
  const { place, place_id, marker } = useContext(RouterContext);

  const position = place?.location || marker;
  if (!position) return null;

  return (
    <Marker
      position={position}
      icon={placeIcon}
      title={place?.name || `Selected place ${place_id}`}
    />
  );
}

export function UserMarker({ position }: { position: GeolocationPosition }) {
  if (!position) return null;

  return (
    <Marker
      position={convertLatLng(position.coords).toJSON()}
      icon={userIcon}
      title="My location"
    />
  );
}
