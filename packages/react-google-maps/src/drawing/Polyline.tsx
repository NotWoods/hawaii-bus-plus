import type { PolylineProps } from '@react-google-maps/api';
import { useMap, useSetter } from '../apply-changes';
import { useGoogleMap } from '../MapProvider';
import { onUnmount } from './Marker';

type Props = Required<Pick<PolylineProps, 'path' | 'options'>>;

function createPolyline(map: google.maps.Map) {
  return { instance: new google.maps.Polyline({ map }), onUnmount };
}

export function Polyline(props: Props) {
  const map = useGoogleMap();
  const polyline = useMap<google.maps.Polyline>(map, createPolyline);

  const { options, path } = props;
  useSetter(polyline, options, (marker) => {
    marker.setOptions(options);
  });
  useSetter(polyline, path, (marker) => {
    marker.setPath(path);
  });

  return null;
}
