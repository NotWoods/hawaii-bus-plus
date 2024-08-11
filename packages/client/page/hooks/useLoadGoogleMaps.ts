import {
  useGoogleApiLoaded,
  type LoaderOptions,
} from '@hawaii-bus-plus/react-google-maps';
import { GOOGLE_MAPS_KEY } from '../../services/env';
import { useOnline } from './useOnline';

export const googleMapOptions: LoaderOptions = {
  apiKey: GOOGLE_MAPS_KEY,
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
