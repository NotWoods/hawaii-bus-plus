import {
  useGoogleApiLoaded,
  type LoaderOptions,
} from '@hawaii-bus-plus/react-google-maps';
import { useOnline } from './useOnline';

export const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY as string;

export const googleMapOptions: LoaderOptions = {
  apiKey: googleMapsApiKey,
  id: 'gmaps-script',
  libraries: ['places' as const],
};

const offlineResponse = { isLoaded: false, loadError: new Error('Offline') };

export function useLoadGoogleMaps(): { isLoaded: boolean; loadError?: Error } {
  const online = useOnline();
  const loaded = useGoogleApiLoaded();
  if (online) {
    return loaded;
  } else {
    return offlineResponse;
  }
}
