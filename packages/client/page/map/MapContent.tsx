import {
  center,
  darkStyles,
  GoogleMap,
  lightStyles,
  mapTypeControlOptions,
} from '@hawaii-bus-plus/react-google-maps';
import { h } from 'preact';
import { useCallback, useMemo } from 'preact/hooks';
import { useDarkMode, useScreens } from '../hooks';
import { openPlace, setMarker } from '../router/action/point';
import { useDispatch } from '../router/hooks';
import { MapBounds } from './MapBounds';
import { PlaceMarker } from './PlaceMarker';
import { RouteGlyphs } from './RouteGlyphs';
import { UserMarker } from './UserMarker';

type MapMouseEvent = google.maps.MapMouseEvent;

export function MapContent() {
  const mdMatches = useScreens('md');
  const darkMode = useDarkMode();
  const dispatch = useDispatch();

  const handleClick = useCallback(
    (evt: MapMouseEvent) => {
      const event = evt as MapMouseEvent & Partial<google.maps.IconMouseEvent>;
      event.stop();
      if (event.placeId) {
        dispatch(openPlace(event.placeId, event.latLng.toJSON()));
      } else {
        dispatch(setMarker(event.latLng.toJSON()));
      }
    },
    [dispatch],
  );

  const options = useMemo<google.maps.MapOptions>(() => {
    const options: google.maps.MapOptions = {
      streetViewControl: false,
      fullscreenControl: false,
      mapTypeControlOptions,
      controlSize: 32,
      gestureHandling: 'greedy',
    };

    options.styles = darkMode ? darkStyles : lightStyles;
    if (mdMatches) {
      options.mapTypeControlOptions!.position =
        google.maps.ControlPosition.TOP_LEFT;
      options.zoomControlOptions = {
        position: google.maps.ControlPosition.TOP_RIGHT,
      };
    } else {
      options.mapTypeControlOptions!.position =
        google.maps.ControlPosition.BOTTOM_CENTER;
      options.zoomControlOptions = {
        position: google.maps.ControlPosition.LEFT_BOTTOM,
      };
    }

    return options;
  }, [darkMode, mdMatches]);

  return (
    <GoogleMap
      mapContainerClassName="w-full h-full"
      defaultCenter={center}
      defaultZoom={9}
      options={options}
      onClick={handleClick}
    >
      <MapBounds />
      <RouteGlyphs darkMode={darkMode} />
      <PlaceMarker />
      <UserMarker />
    </GoogleMap>
  );
}
