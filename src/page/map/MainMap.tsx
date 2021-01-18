import React, { useContext } from 'react';
import {
  center,
  darkStyles,
  GoogleMapPortal,
  mapTypeControlOptions,
} from '../../react-google-maps';
import { openPlace, setMarker } from '../router/action';
import { RouterContext } from '../router/Router';
import { StopMarkers } from './StopMarkers';

interface Props {
  darkMode?: boolean;
}

type MapMouseEvent = google.maps.MapMouseEvent;

export function MainMap(props: Props) {
  const { dispatch } = useContext(RouterContext);

  function handleClick(evt: MapMouseEvent) {
    const event = evt as MapMouseEvent & Partial<google.maps.IconMouseEvent>;
    if (event.placeId) {
      dispatch(
        openPlace({
          place_id: event.placeId,
          geometry: { location: event.latLng },
        })
      );
    } else {
      dispatch(setMarker(event.latLng.toJSON()));
    }
  }

  return (
    <GoogleMapPortal
      mapContainerClassName="map w-full h-full"
      center={center}
      zoom={9}
      options={{
        streetViewControl: false,
        mapTypeControlOptions,
        controlSize: 32,
        styles: props.darkMode
          ? (darkStyles as google.maps.MapTypeStyle[])
          : undefined,
      }}
      onClick={handleClick}
    >
      <StopMarkers />
    </GoogleMapPortal>
  );
}
