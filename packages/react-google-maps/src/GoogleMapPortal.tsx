import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { GoogleMap, GoogleMapProps } from './GoogleMap';
import { useLoadGoogleMaps } from './hooks';
import { MapSetterContext } from './MapProvider';

interface Props extends Omit<GoogleMapProps, 'onLoad'> {
  googleMapsApiKey: string;
}

/**
 * Displays a `GoogleMap` while linking it with the context of `MapProvider`.
 */
export function GoogleMapPortal({ googleMapsApiKey, ...props }: Props) {
  const setMap = useContext(MapSetterContext);
  const { isLoaded } = useLoadGoogleMaps(googleMapsApiKey);

  if (!isLoaded) return null;

  return <GoogleMap {...props} onLoad={setMap} />;
}
