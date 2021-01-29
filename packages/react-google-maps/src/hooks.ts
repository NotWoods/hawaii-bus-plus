import { MapContext, useLoadScript } from '@react-google-maps/api';
import { useContext } from 'react';

// @ts-ignore
export const googleMapsApiKey: string = import.meta.env.VITE_GOOGLE_MAPS_KEY;

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
