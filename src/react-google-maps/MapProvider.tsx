import React, { createContext, ReactNode, useState } from 'react';
import { MapContext } from '@react-google-maps/api';

type MapSetterContext = (map: google.maps.Map) => void;

export const MapSetterContext = createContext<MapSetterContext>(() => {});

/**
 * Creates a `MapContext` that can have its map set by a child element.
 * This can be used with `GoogleMapsPortal` to expose a google map to sibling elements,
 * such as a street view panorama.
 */
export function MapProvider(props: { children?: ReactNode }) {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  return (
    <MapSetterContext.Provider value={setMap}>
      <MapContext.Provider value={map}>{props.children}</MapContext.Provider>
    </MapSetterContext.Provider>
  );
}
