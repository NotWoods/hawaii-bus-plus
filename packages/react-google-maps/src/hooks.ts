import { useLoadScript } from '@react-google-maps/api';
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';

// @ts-ignore
export const googleMapsApiKey: string = import.meta.env.VITE_GOOGLE_MAPS_KEY;

export const MapContext = createContext<google.maps.Map | null>(null);

/**
 * Variant of the react-google-map function that doesn't throw if map is null.
 */
export function useGoogleMap() {
  return useContext(MapContext);
}

const options: Parameters<typeof useLoadScript>[0] = {
  googleMapsApiKey,
  libraries: ['places'],
};

/**
 * Variant of `useLoadScript` that has the options all set.
 */
export function useLoadGoogleMaps() {
  return useLoadScript(options);
}
