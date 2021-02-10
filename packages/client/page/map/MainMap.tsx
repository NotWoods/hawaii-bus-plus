import {
  center,
  darkStyles,
  GoogleMapPortal,
  mapTypeControlOptions,
  useLoadGoogleMaps,
} from '@hawaii-bus-plus/react-google-maps';
import { h } from 'preact';
import { useContext, useMemo } from 'preact/hooks';
import { openPlace, setMarker } from '../router/action';
import { RouterContext } from '../router/Router';
import { PlaceMarker } from './PlaceMarker';
import { RouteGlyphs } from './RouteGlyphs';

interface Props {
  darkMode?: boolean;
}

type MapMouseEvent = google.maps.MapMouseEvent;

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY as string;

export function MainMap(props: Props) {
  const { dispatch } = useContext(RouterContext);
  const { isLoaded } = useLoadGoogleMaps(googleMapsApiKey);

  function handleClick(evt: MapMouseEvent) {
    const event = evt as MapMouseEvent & Partial<google.maps.IconMouseEvent>;
    event.stop();
    if (event.placeId) {
      dispatch(openPlace(event.placeId, event.latLng.toJSON()));
    } else {
      dispatch(setMarker(event.latLng.toJSON()));
    }
  }

  const options = useMemo<google.maps.MapOptions>(
    () => ({
      streetViewControl: false,
      fullscreenControl: false,
      zoomControlOptions: {
        position: isLoaded ? google.maps.ControlPosition.TOP_RIGHT : undefined,
      },
      mapTypeControlOptions,
      controlSize: 32,
      styles: props.darkMode ? darkStyles : undefined,
      gestureHandling: 'greedy',
    }),
    [isLoaded, props.darkMode]
  );

  return (
    <section class="fixed sheet h-full inset-x-0 md:ml-80">
      <GoogleMapPortal
        googleMapsApiKey={googleMapsApiKey}
        mapContainerClassName="w-full h-full"
        defaultCenter={center}
        defaultZoom={9}
        options={options}
        onClick={handleClick}
      >
        <RouteGlyphs darkMode={props.darkMode} />
        <PlaceMarker />
      </GoogleMapPortal>
    </section>
  );
}
