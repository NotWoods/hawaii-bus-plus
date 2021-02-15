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

export function useLoadGoogleMaps() {
  // return { isLoaded: false, loadError: new Error() };
  return useGoogleApiLoaded();
}
