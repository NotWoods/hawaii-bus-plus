import { h } from 'preact';
import { useRef } from 'preact/hooks';
import { useListener, useMap, useSetter } from '../apply-changes';
import { useGoogleMap } from '../MapProvider';

interface Props {
  class?: string;
  position: google.maps.LatLngLiteral;
  pov: google.maps.StreetViewPov;
  onStatusChange?(this: google.maps.StreetViewPanorama): void;
}

const options = {
  visible: true,
  clickToGo: false,
  motionTracking: false,
  panControl: false,
  linksControl: false,
  enableCloseButton: false,
  controlSize: 32,
  mode: 'webgl' as const,
};

function onUnmountStreetView(_: unknown, map: google.maps.Map) {
  map.setStreetView(null);
}

/**
 * Build a street view panorama.
 */
export function StreetViewPano(props: Props) {
  const divRef = useRef<HTMLDivElement>(null);

  const map = useGoogleMap();

  const streetView = useMap<google.maps.StreetViewPanorama>(map, (map) => {
    const streetView = new google.maps.StreetViewPanorama(
      divRef.current,
      options,
    );

    map.setStreetView(streetView);

    return { instance: streetView, onUnmount: onUnmountStreetView };
  });

  const { position, pov } = props;
  useSetter(streetView, position, (streetView) => {
    streetView.setPosition(position);
  });
  useSetter(streetView, pov, (streetView) => {
    streetView.setPov(pov);
  });

  useListener(streetView, 'status_changed', props.onStatusChange);

  return <div class={props.class} ref={divRef} />;
}
