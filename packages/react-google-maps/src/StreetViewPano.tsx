import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { useListener, useMap } from './apply-changes';
import { useGoogleMap, useLoadGoogleMaps } from './hooks';

export interface StreetViewPanoProps {
  className?: string;
  googleMapsApiKey: string;
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

/**
 * Build a street view panorama.
 * Fallbacks to an image if the Google Maps API hasn't loaded.
 */
export function StreetViewPano(props: StreetViewPanoProps) {
  const divRef = useRef(null);

  const map = useGoogleMap();
  const { loadError } = useLoadGoogleMaps(props.googleMapsApiKey);

  const streetView = useMap<google.maps.StreetViewPanorama>(
    map,
    (setInstance) => {
      const streetView = new google.maps.StreetViewPanorama(
        divRef.current!,
        options
      );

      map!.setStreetView(streetView);

      setInstance(streetView);

      return () => map!.setStreetView(null);
    }
  );

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
    url.searchParams.set('key', props.googleMapsApiKey);
    // Fallback to static image
    return <img className={props.className} alt="Street view" src={url.href} />;
  } else {
    return <div className={props.className} ref={divRef} />;
  }
}
