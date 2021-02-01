import { ComponentChildren, createContext, h } from 'preact';
import { useState } from 'preact/hooks';
import { MapContext } from './hooks';

type MapSetterContext = (map: google.maps.Map) => void;

export const MapSetterContext = createContext<MapSetterContext>(() => {});

/**
 * Creates a `MapContext` that can have its map set by a child element.
 * This can be used with `GoogleMapsPortal` to expose a google map to sibling elements,
 * such as a street view panorama.
 */
export function MapProvider(props: { children?: ComponentChildren }) {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  return (
    <MapSetterContext.Provider value={setMap}>
      <MapContext.Provider value={map}>{props.children}</MapContext.Provider>
    </MapSetterContext.Provider>
  );
}
