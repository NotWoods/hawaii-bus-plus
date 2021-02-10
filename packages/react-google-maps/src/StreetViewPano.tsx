import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { useListener, useMap } from './apply-changes';
import { useGoogleMap } from './hooks';

export interface StreetViewPanoProps {
  class?: string;
  googleMapsApiKey: string;
  position: google.maps.LatLngLiteral;
  onStatusChange?(this: google.maps.StreetViewPanorama): void;
}

const options = {
  pov: { heading: 34, pitch: 0 },
  visible: true,
  clickToGo: false,
  motionTracking: false,
  panControl: false,
  linksControl: false,
  enableCloseButton: false,
  controlSize: 32,
  mode: 'webgl' as const,
};

/**
 * Build a street view panorama.
 */
export function StreetViewPano(
  props: Omit<StreetViewPanoProps, 'googleMapsApiKey'>
) {
  const divRef = useRef(null);

  const map = useGoogleMap();

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

  useListener(streetView, 'status_changed', props.onStatusChange);

  return <div class={props.class} ref={divRef} />;
}

/**
 * Street view static image
 */
export function StreetViewStatic(
  props: Omit<StreetViewPanoProps, 'onStatusChange'>
) {
  const url = new URL('https://maps.googleapis.com/maps/api/streetview');
  url.searchParams.set('size', '474x266');
  url.searchParams.set(
    'location',
    `${props.position.lat},${props.position.lng}`
  );
  url.searchParams.set('heading', options.pov.heading.toString());
  url.searchParams.set('pitch', options.pov.pitch.toString());
  url.searchParams.set('key', props.googleMapsApiKey);

  return <img class={props.class} alt="Street view" src={url.href} />;
}
