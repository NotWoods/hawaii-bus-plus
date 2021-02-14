import { Marker } from '@hawaii-bus-plus/react-google-maps';
import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { RouterContext } from '../router/Router';
import { pinsIcon } from './pins';

const placeIcon = pinsIcon(3);

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
