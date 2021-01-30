import React, { useEffect, useRef, useState } from 'react';
import { googleMapsApiKey, useGoogleMap, useLoadGoogleMaps } from './hooks';

export interface StreetViewPanoProps {
  className?: string;
  position: google.maps.LatLngLiteral;
  visible: boolean;
  onClose?(this: google.maps.StreetViewPanorama): void;
  onStatusChange?(this: google.maps.StreetViewPanorama): void;
}

const options = {
  pov: { heading: 34, pitch: 0 },
  visible: true,
  clickToGo: false,
  motionTracking: false,
  panControl: false,
  linksControl: false,
  enableCloseButton: true,
  controlSize: 32,
  mode: 'webgl' as const,
};

function useListener(
  streetView: google.maps.StreetViewPanorama | undefined,
  eventName: string,
  onEvent: ((this: google.maps.StreetViewPanorama) => void) | undefined
) {
  useEffect(() => {
    if (streetView && onEvent) {
      const listener = google.maps.event.addListener(
        streetView,
        eventName,
        onEvent
      );
      return () => listener.remove();
    } else {
      return undefined;
    }
  }, [streetView, onEvent]);
}

/**
 * Build a street view panorama.
 * Fallbacks to an image if the Google Maps API hasn't loaded.
 */
export function StreetViewPano(props: StreetViewPanoProps) {
  const divRef = useRef(null);
  const [streetView, setStreetView] = useState<
    google.maps.StreetViewPanorama | undefined
  >();

  const map = useGoogleMap();
  const { isLoaded, loadError } = useLoadGoogleMaps();

  useEffect(() => {
    if (!isLoaded || loadError) return undefined;

    const streetView = new google.maps.StreetViewPanorama(
      divRef.current!,
      options
    );

    map?.setStreetView(streetView);

    setStreetView(streetView);

    return () => map?.setStreetView(null);
  }, [isLoaded, map]);

  useEffect(() => {
    streetView?.setPosition(props.position);
  }, [streetView, props.position]);
  useEffect(() => {
    streetView?.setVisible(props.visible);
  }, [streetView, props.visible]);

  useListener(streetView, 'closeclick', props.onClose);
  useListener(streetView, 'status_changed', props.onStatusChange);

  if (loadError) {
    const url = new URL('https://maps.googleapis.com/maps/api/streetview');
    url.searchParams.set('size', '474x266');
    url.searchParams.set(
      'location',
      `${props.position.lat},${props.position.lng}`
    );
    url.searchParams.set('heading', options.pov.heading.toString());
    url.searchParams.set('pitch', options.pov.pitch.toString());
    url.searchParams.set('key', googleMapsApiKey);
    // Fallback to static image
    return <img className={props.className} alt="Street view" src={url.href} />;
  } else {
    return <div className={props.className} ref={divRef} />;
  }
}
