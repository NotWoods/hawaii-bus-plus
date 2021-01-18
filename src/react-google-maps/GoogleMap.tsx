import { GoogleMap, GoogleMapProps } from '@react-google-maps/api';
import React, { useContext } from 'react';
import { useLoadGoogleMaps } from './hooks.js';
import { MapSetterContext } from './MapProvider.js';

/**
 * Displays a `GoogleMap` while linking it with the context of `MapProvider`.
 */
export function GoogleMapPortal(props: Omit<GoogleMapProps, 'onLoad'>) {
  const setMap = useContext(MapSetterContext);
  const { isLoaded } = useLoadGoogleMaps();

  if (!isLoaded) return null;

  return <GoogleMap {...props} onLoad={setMap} />;
}
