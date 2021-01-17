import React, { createContext, ReactNode, useState } from 'react';
import { MapContext } from '@react-google-maps/api';

type MapSetterContext = (map: google.maps.Map) => void;

export const MapSetterContext = createContext<MapSetterContext>(() => {});

export function MapProvider(props: { children?: ReactNode }) {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  return (
    <MapSetterContext.Provider value={setMap}>
      <MapContext.Provider value={map}>{props.children}</MapContext.Provider>
    </MapSetterContext.Provider>
  );
}
