import { useListener, useMap, useSetter } from '../apply-changes';
import { useGoogleMap } from '../MapProvider';

interface Props {
  /** The marker's opacity between 0.0 and 1.0. */
  opacity?: number;
  /** Marker position. */
  position: google.maps.LatLng | google.maps.LatLngLiteral;
  /** Rollover text */
  title: string;
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

export function onUnmount(instance: { setMap(map: null): void }) {
  instance.setMap(null);
}

export function Marker<T>(props: Props | PropsWithData<T>) {
  const { position, title, icon = null, opacity = 1 } = props;

  const map = useGoogleMap();
  const marker = useMap<MarkerWithData<T>>(map, (map) => {
    const instance = new google.maps.Marker({ map, position });

    return { instance, onUnmount };
  });
  const dataExtra = (props as Partial<PropsWithData<T>>)['data-extra'];

  useSetter(marker, title, (marker) => {
    marker.setTitle(title);
  });
  useSetter(marker, position, (marker) => {
    marker.setPosition(position);
  });
  useSetter(marker, icon, (marker) => {
    marker.setIcon(icon);
  });
  useSetter(marker, opacity, (marker) => {
    marker.setOpacity(opacity);
  });
  useSetter(marker, dataExtra, (marker) => {
    marker.set('extra', dataExtra!);
  });

  useListener(marker, 'click', props.onClick);

  return null;
}
