import {
  useGoogleApiLoaded,
  LoaderOptions,
} from '@hawaii-bus-plus/react-google-maps';

export const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY as string;

export const googleMapOptions: LoaderOptions = {
  apiKey: googleMapsApiKey,
  id: 'gmaps-script',
  libraries: ['places' as const],
};

/**
 * Variant of `useLoadScript` that has the options all set.
 */
export const useLoadGoogleMaps = useGoogleApiLoaded;
