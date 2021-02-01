import { useJsApiLoader } from '@react-google-maps/api';
import { createContext } from 'preact';
import { useContext, useMemo } from 'preact/hooks';

export const MapContext = createContext<google.maps.Map | null>(null);

/**
 * Variant of the react-google-map function that doesn't throw if map is null.
 */
export function useGoogleMap() {
  return useContext(MapContext);
}

/**
 * Variant of `useLoadScript` that has the options all set.
 */
export function useLoadGoogleMaps(googleMapsApiKey: string) {
  const options = useMemo(
    () => ({
      googleMapsApiKey,
      libraries: ['places' as const],
    }),
    [googleMapsApiKey]
  );

  return useJsApiLoader(options);
}
