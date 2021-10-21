import { h, ComponentChildren } from 'preact';
import { useContext, useEffect, useRef } from 'preact/hooks';
import { useListener } from './apply-changes';
import { MapContext } from './MapProvider';

export interface GoogleMapProps {
  children?: ComponentChildren;
  mapContainerClassName?: string;
  options?: google.maps.MapOptions;
  /** The initial Map center. */
  defaultCenter: google.maps.LatLng | google.maps.LatLngLiteral;
  /** The initial Map zoom level. Required. Valid values: Integers between zero, and up to the supported maximum zoom level. */
  defaultZoom: number;
  /** This event is fired when the user clicks on the map. An ApiMouseEvent with properties for the clicked location is returned unless a place icon was clicked, in which case an IconMouseEvent with a placeId is returned. IconMouseEvent and ApiMouseEvent are identical, except that IconMouseEvent has the placeId field. The event can always be treated as an ApiMouseEvent when the placeId is not important. The click event is not fired if a Marker or InfoWindow was clicked. */
  onClick?: (e: google.maps.MapMouseEvent) => void;
  /** This callback is called when the map instance has loaded. It is called with the map instance. */
  onLoad?(map: google.maps.Map): void;
}

/**
 * Displays a `GoogleMap` while linking it with the context of `MapProvider`.
 */
export function GoogleMap(props: GoogleMapProps) {
  const { map, setMap } = useContext(MapContext);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const map = new google.maps.Map(mapRef.current!, {
      ...props.options,
      center: props.defaultCenter,
      zoom: props.defaultZoom,
    });
    setMap(map);
    props.onLoad?.(map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    map && props.options && map.setOptions(props.options);
  }, [map, props.options]);

  useListener(map, 'click', props.onClick);

  return (
    <div ref={mapRef} class={props.mapContainerClassName}>
      {map !== null ? props.children : null}
    </div>
  );
}
