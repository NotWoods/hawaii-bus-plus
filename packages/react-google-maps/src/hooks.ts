export { useJsApiLoader } from '@react-google-maps/api';
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';

export const MapContext = createContext<google.maps.Map | null>(null);

/**
 * Variant of the react-google-map function that doesn't throw if map is null.
 */
export function useGoogleMap() {
  return useContext(MapContext);
}
