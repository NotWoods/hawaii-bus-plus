import React, { useContext } from 'react';
import {
  center,
  darkStyles,
  GoogleMapPortal,
  mapTypeControlOptions,
} from '@hawaii-bus-plus/react-google-maps';
import { openPlace, setMarker } from '../router/action';
import { RouterContext } from '../router/Router';
import { PlaceMarker, UserMarker } from './PlaceMarker';
import { StopMarkers } from './StopMarkers';

interface Props {
  darkMode?: boolean;
  position?: GeolocationPosition;
}

type MapMouseEvent = google.maps.MapMouseEvent;

export function MainMap(props: Props) {
  const { dispatch } = useContext(RouterContext);

  function handleClick(evt: MapMouseEvent) {
    const event = evt as MapMouseEvent & Partial<google.maps.IconMouseEvent>;
    event.stop();
    if (event.placeId) {
      dispatch(
        openPlace({
          name: '',
          place_id: event.placeId,
          location: event.latLng.toJSON(),
        })
      );
    } else {
      dispatch(setMarker(event.latLng.toJSON()));
    }
  }

  return (
    <GoogleMapPortal
      mapContainerClassName="map w-full h-full position-fixed"
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
      <PlaceMarker />
      {props.position ? <UserMarker position={props.position} /> : null}
    </GoogleMapPortal>
  );
}
