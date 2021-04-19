import { Marker } from '@hawaii-bus-plus/react-google-maps';
import { h } from 'preact';
import { useSelector } from '../router/hooks';
import { selectPoint } from '../router/selector/point';
import { pinsIcon } from './pins';

const placeIcon = pinsIcon(3);

export function PlaceMarker() {
  const point = useSelector(selectPoint);

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
