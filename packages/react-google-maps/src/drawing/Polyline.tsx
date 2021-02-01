import type { PolylineProps } from '@react-google-maps/api';
import { useEffect } from 'preact/hooks';
import { useMap } from '../apply-changes';
import { useGoogleMap } from '../hooks';

type Props = Pick<PolylineProps, 'path' | 'options'>;

export function Polyline(props: Props) {
  const map = useGoogleMap();
  const marker = useMap<google.maps.Polyline>(map, (setInstance, map) => {
    const marker = new google.maps.Polyline({ map });
    setInstance(marker);

    return () => marker.setMap(null);
  });

  useEffect(() => {
    marker?.setOptions(props.options!);
  }, [marker, props.options]);
  useEffect(() => {
    marker?.setPath(props.path!);
  }, [marker, props.path]);

  return null;
}
