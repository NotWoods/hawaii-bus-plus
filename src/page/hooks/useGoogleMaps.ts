import { MapContext, useLoadScript } from '@react-google-maps/api';
import { useContext } from 'react';

export const googleMapsApiKey = 'AIzaSyAmRiFwEOokwUHYXK1MqYl5k2ngHoWGJBw';

/**
 * Variant of the react-google-map function that doesn't throw if map is null.
 */
export function useGoogleMap() {
  return useContext(MapContext);
}

/**
 * Variant of `useLoadScript` that has the options all set.
 */
export function useLoadGoogleMaps() {
  return useLoadScript({ googleMapsApiKey });
}
