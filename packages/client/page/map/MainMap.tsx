import {
  center,
  darkStyles,
  GoogleMapPortal,
  mapTypeControlOptions,
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

export function MainMap(props: Props) {
  const { dispatch } = useContext(RouterContext);

  function handleClick(evt: MapMouseEvent) {
    const event = evt as MapMouseEvent & Partial<google.maps.IconMouseEvent>;
    event.stop();
    if (event.placeId) {
      dispatch(openPlace(event.placeId, event.latLng.toJSON()));
    } else {
      dispatch(setMarker(event.latLng.toJSON()));
    }
  }

  const options = useMemo(
    () => ({
      streetViewControl: false,
      mapTypeControlOptions,
      controlSize: 32,
      styles: props.darkMode ? darkStyles : undefined,
    }),
    [props.darkMode]
  );

  return (
    <GoogleMapPortal
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY as string}
      mapContainerClassName="map w-full h-full position-fixed"
      defaultCenter={center}
      defaultZoom={9}
      options={options}
      onClick={handleClick}
    >
      <RouteGlyphs darkMode={props.darkMode} />
      <PlaceMarker />
    </GoogleMapPortal>
  );
}
