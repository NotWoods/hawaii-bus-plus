import { Marker } from '@hawaii-bus-plus/react-google-maps';
import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { convertLatLng } from 'spherical-geometry-js';
import { MyLocationContext } from './location/context';

const userIcon = {
  url: '/pins.png',
  size: { height: 26, width: 24 },
  scaledSize: { height: 26, width: 120 },
  origin: { x: 48, y: 0 },
  anchor: { x: 12, y: 23 },
} as google.maps.Icon;

export function UserMarker() {
  const { coords } = useContext(MyLocationContext);

  if (!coords) return null;

  const position = convertLatLng(coords).toJSON();
  return <Marker position={position} icon={userIcon} title="My location" />;
}
