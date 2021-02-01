import type { GoogleMapProps as OrigGoogleMapProps } from '@react-google-maps/api';
import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { useListener } from './apply-changes';
import { MapContext } from './hooks';

export interface GoogleMapProps
  extends Pick<
    OrigGoogleMapProps,
    'children' | 'mapContainerClassName' | 'options' | 'onClick' | 'onLoad'
  > {
  defaultCenter: google.maps.LatLng | google.maps.LatLngLiteral;
  defaultZoom: number;
}

/**
 * Displays a `GoogleMap` while linking it with the context of `MapProvider`.
 */
export function GoogleMap(props: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>();
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    const map = new google.maps.Map(mapRef.current, {
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
    <div ref={mapRef} className={props.mapContainerClassName}>
      <MapContext.Provider value={map}>
        {map !== null ? props.children : null}
      </MapContext.Provider>
    </div>
  );
}
