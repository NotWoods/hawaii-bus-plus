import { GoogleMap, GoogleMapProps } from '@react-google-maps/api';
import React, { useContext } from 'react';
import { useLoadGoogleMaps } from '../hooks/useGoogleMaps';
import { MapSetterContext } from './MapProvider';

export function GoogleMapPortal(props: Omit<GoogleMapProps, 'onLoad'>) {
  const setMap = useContext(MapSetterContext);
  const { isLoaded } = useLoadGoogleMaps();

  if (!isLoaded) return null;

  return <GoogleMap {...props} onLoad={setMap} />;
}
