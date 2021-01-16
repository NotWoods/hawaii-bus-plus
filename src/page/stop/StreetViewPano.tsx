import React, { ReactNode, useEffect, useRef } from 'react';
import { useGoogleMap } from '@react-google-maps/api';

interface Props {
  className?: string;
  children?: ReactNode;
  position: google.maps.LatLng | google.maps.LatLngLiteral;
  onClose(this: google.maps.StreetViewPanorama): void;
}

const options: google.maps.StreetViewPanoramaOptions = {
  visible: true,
  pov: { heading: 34, pitch: 0 },
  clickToGo: false,
  motionTracking: false,
  panControl: false,
  linksControl: false,
  enableCloseButton: true,
};

export function StreetViewPano(props: Props) {
  const divRef = useRef(null);
  const streetViewRef = useRef<google.maps.StreetViewPanorama>(null);
  const map = useGoogleMap();

  useEffect(() => {
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
    streetViewRef.current = streetView;

    return () => {
      listener.remove();
      map?.setStreetView(null);
    };
  }, [map]);

  useEffect(() => {
    streetViewRef.current!.setPosition(props.position);
  }, [props.position]);

  return (
    <div className={props.className} ref={divRef}>
      {props.children}
    </div>
  );
}
