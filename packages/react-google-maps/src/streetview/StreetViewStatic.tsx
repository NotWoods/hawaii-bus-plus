import { h } from 'preact';

interface Props {
  class?: string;
  position: google.maps.LatLngLiteral;
  pov: Required<google.maps.StreetViewPov>;
  size: string;
  googleMapsApiKey: string;
}

/**
 * Street view static image
 */
export function StreetViewStatic(props: Props) {
  const {
    position: { lat, lng },
    pov,
    size,
  } = props;
  const url = new URL('https://maps.googleapis.com/maps/api/streetview');
  url.searchParams.set('size', size);
  url.searchParams.set('location', `${lat},${lng}`);
  url.searchParams.set('heading', pov.heading.toString());
  url.searchParams.set('pitch', pov.pitch.toString());
  url.searchParams.set('key', props.googleMapsApiKey);

  return <img class={props.class} alt="Street view" src={url.href} />;
}
