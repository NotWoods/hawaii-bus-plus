import { LoaderOptions } from '@googlemaps/js-api-loader';
import { ComponentChildren, createContext, h } from 'preact';
import { useState, useContext } from 'preact/hooks';
import { useJsApiLoader } from './hooks';

export type { LoaderOptions };

export interface MapContext {
  isLoaded: boolean;
  map?: google.maps.Map | undefined;
  loadError?: Error | undefined;
  setMap(map: google.maps.Map): void;
}

export const MapContext = createContext<MapContext>({
  isLoaded: false,
  setMap() {},
});

export function MapProvider(props: {
  options: LoaderOptions;
  children?: ComponentChildren;
}) {
  const [map, setMap] = useState<google.maps.Map | undefined>(undefined);
  const { isLoaded, loadError } = useJsApiLoader(props.options);

  return (
    <MapContext.Provider value={{ isLoaded, map, loadError, setMap }}>
      {props.children}
    </MapContext.Provider>
  );
}

export function useGoogleMap() {
  const { map } = useContext(MapContext);
  return map;
}

export function useGoogleApiLoaded() {
  const { isLoaded, loadError } = useContext(MapContext);
  return { isLoaded, loadError };
}
