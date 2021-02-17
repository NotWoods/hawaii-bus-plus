import { useEffect } from 'preact/hooks';
import { useListener, useMap } from '../apply-changes';
import { useGoogleMap } from '../MapProvider';

interface Props {
  /** The marker's opacity between 0.0 and 1.0. */
  opacity?: number;
  /** Marker position. */
  position: google.maps.LatLng | google.maps.LatLngLiteral;
  /** Rollover text */
  title?: string;
  /** Icon for the foreground. If a string is provided, it is treated as though it were an Icon with the string as url. */
  icon?: string | google.maps.Icon | google.maps.Symbol;
  /** This event is fired when the marker icon was clicked. */
  onClick?(this: google.maps.Marker, evt: google.maps.MapMouseEvent): void;
}

interface PropsWithData<T> extends Props {
  /** Custom data to attach to the marker. */
  'data-extra': T;
  /** This event is fired when the marker icon was clicked. */
  onClick?(this: MarkerWithData<T>, evt: google.maps.MapMouseEvent): void;
}

export interface MarkerWithData<T> extends google.maps.Marker {
  get(key: 'extra'): T;
  set(key: 'extra', value: T): void;
}

export function Marker<T>(props: Props | PropsWithData<T>) {
  const map = useGoogleMap();
  const marker = useMap<MarkerWithData<T>>(map, (setInstance, map) => {
    const marker = new google.maps.Marker({
      map,
      position: props.position,
    });
    setInstance(marker);

    return () => marker.setMap(null);
  });
  const dataExtra = (props as Partial<PropsWithData<T>>)['data-extra'];

  useEffect(() => {
    marker?.setTitle(props.title ?? null);
  }, [marker, props.title]);
  useEffect(() => {
    marker?.setPosition(props.position);
  }, [marker, props.position]);
  useEffect(() => {
    marker?.setIcon(props.icon ?? null);
  }, [marker, props.icon]);
  useEffect(() => {
    marker?.setOpacity(props.opacity ?? null);
  }, [marker, props.opacity]);
  useEffect(() => {
    marker?.set('extra', dataExtra!);
  }, [marker, dataExtra]);

  useListener(marker, 'click', props.onClick);

  return null;
}
