import { Marker } from '@hawaii-bus-plus/react-google-maps';
import { h } from 'preact';
import { useContext } from 'preact/hooks';
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
  const { point } = useContext(RouterContext);

  switch (point?.type) {
    case 'place':
      return (
        <Marker
          position={point.position}
          icon={placeIcon}
          title={point.name ?? `Selected point ${point.placeId}`}
        />
      );
    case 'marker':
      return (
        <Marker
          position={point.position}
          icon={placeIcon}
          title={point.name ?? 'Selected point'}
        />
      );
    default:
      return null;
  }
}

export function UserMarker({
  position,
}: {
  position: google.maps.LatLngLiteral;
}) {
  if (!position) return null;

  return <Marker position={position} icon={userIcon} title="My location" />;
}
