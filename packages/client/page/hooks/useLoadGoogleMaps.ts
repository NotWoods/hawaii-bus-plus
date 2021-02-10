import { useJsApiLoader } from '@hawaii-bus-plus/react-google-maps';

export const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY as string;

const options = {
  googleMapsApiKey,
  libraries: ['places' as const],
};

/**
 * Variant of `useLoadScript` that has the options all set.
 */
export function useLoadGoogleMaps() {
  return useJsApiLoader(options);
}
