import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { GoogleMap, GoogleMapProps } from './GoogleMap';
import { MapSetterContext } from './MapProvider';

type Props = Omit<GoogleMapProps, 'onLoad'>;

/**
 * Displays a `GoogleMap` while linking it with the context of `MapProvider`.
 */
export function GoogleMapPortal(props: Props) {
  const setMap = useContext(MapSetterContext);

  return <GoogleMap {...props} onLoad={setMap} />;
}
