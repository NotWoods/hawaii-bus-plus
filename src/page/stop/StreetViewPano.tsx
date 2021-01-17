import React, { useEffect, useRef, useState } from 'react';
import {
  googleMapsApiKey,
  useGoogleMap,
  useLoadGoogleMaps,
} from '../hooks/useGoogleMaps';

export interface StreetViewPanoProps {
  className?: string;
  position: google.maps.LatLngLiteral;
  visible: boolean;
  onClose(this: google.maps.StreetViewPanorama): void;
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
};

export function StreetViewPano(props: StreetViewPanoProps) {
  const divRef = useRef(null);
  const [streetView, setStreetView] = useState<
    google.maps.StreetViewPanorama | undefined
  >();
  const map = useGoogleMap();
  const { isLoaded, loadError } = useLoadGoogleMaps();

  useEffect(() => {
    if (!isLoaded || loadError) return;

    const streetView = new google.maps.StreetViewPanorama(
      divRef.current!,
      options
    );

    const listener = google.maps.event.addListenerOnce(
      streetView,
      'closeclick',
      props.onClose
    );
    map?.setStreetView(streetView);

    // @ts-ignore
    setStreetView(streetView);

    return () => {
      listener.remove();
      map?.setStreetView(null);
    };
  }, [isLoaded, map]);

  useEffect(() => {
    streetView?.setPosition(props.position);
  }, [streetView, props.position]);
  useEffect(() => {
    streetView?.setVisible(props.visible);
  }, [streetView, props.visible]);

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
