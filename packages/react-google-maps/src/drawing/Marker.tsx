import type { MarkerProps } from '@react-google-maps/api';
import { useEffect } from 'preact/hooks';
import { useListener, useMap } from '../apply-changes';
import { useGoogleMap } from '../hooks';

type Props = Pick<MarkerProps, 'position' | 'title' | 'icon' | 'onClick'>;

export function Marker(props: Props) {
  const map = useGoogleMap();
  const marker = useMap<google.maps.Marker>(map, (setInstance, map) => {
    const marker = new google.maps.Marker({
      map,
      position: props.position,
    });
    setInstance(marker);

    return () => marker.setMap(null);
  });

  useEffect(() => {
    marker?.setTitle(props.title!);
  }, [marker, props.title]);
  useEffect(() => {
    marker?.setPosition(props.position);
  }, [marker, props.position]);
  useEffect(() => {
    marker?.setIcon(props.icon!);
  }, [marker, props.icon]);

  useListener(marker, 'click', props.onClick);

  return null;
}
