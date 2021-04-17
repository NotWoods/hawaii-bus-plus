import { ComponentChildren, createContext, h } from 'preact';
import { useCallback, useMemo, useState } from 'preact/hooks';
import { convertLatLng } from 'spherical-geometry-js';
import {
  GeolocationErrorCode,
  useAbortEffect,
  usePermission,
} from '../../hooks';
import { locationFromIp } from './ipstack';

type Coordinates = Pick<GeolocationCoordinates, 'latitude' | 'longitude'>;

interface MyLocationContext {
  coords?: google.maps.LatLngLiteral;
  error?: GeolocationErrorCode;
  onButtonClick(): void;
}

export const MyLocationContext = createContext<MyLocationContext>({
  error: GeolocationErrorCode.NOT_YET_LOADED,
  onButtonClick() {},
});

declare module 'preact/hooks' {
  export function useState<S>(
    initialState: S | (() => S),
  ): [S, StateUpdater<S>];
  export function useState<S = undefined>(): [
    S | undefined,
    StateUpdater<S | undefined>,
  ];
}

export function MyLocationProvider(props: { children: ComponentChildren }) {
  const status = usePermission({ name: 'geolocation' });
  const [clicked, setClicked] = useState(false);
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [error, setError] = useState<GeolocationErrorCode | undefined>(
    GeolocationErrorCode.NOT_YET_LOADED,
  );

  const coords = useMemo<google.maps.LatLngLiteral | undefined>(() => {
    if (latitude != undefined && longitude != undefined) {
      return { lat: latitude, lng: longitude };
    } else {
      return undefined;
    }
  }, [latitude, longitude]);

  const onButtonClick = useCallback(() => setClicked(true), []);

  function onFetchSuccess(coords: Coordinates) {
    const { lat, lng } = convertLatLng(coords).toJSON();
    setLatitude(lat);
    setLongitude(lng);
    setError(undefined);
    setClicked(false);
  }
  function onGeolocationSuccess(pos: GeolocationPosition) {
    onFetchSuccess(pos.coords);
  }

  useAbortEffect(
    (signal) => {
      let watchId = -1;

      function fallbackGeolocation(err?: GeolocationPositionError) {
        setClicked(false);
        if (latitude == undefined || longitude == undefined) {
          locationFromIp(signal).then(onFetchSuccess, () =>
            setError((currentErr) => {
              if (err) {
                return err.code as GeolocationErrorCode;
              } else {
                return currentErr;
              }
            }),
          );
        }
      }

      switch (status) {
        case 'granted':
          // Already granted, just grab location
          watchId = navigator.geolocation.watchPosition(
            onGeolocationSuccess,
            fallbackGeolocation,
          );
          break;
        case 'prompt':
          if (clicked) {
            watchId = navigator.geolocation.watchPosition(
              onGeolocationSuccess,
              fallbackGeolocation,
            );
          } else {
            fallbackGeolocation();
          }
          break;
        case 'denied':
          if (latitude == undefined || longitude == undefined) {
            fallbackGeolocation();
            if (clicked) {
              // TODO tell user geolocation is denied
            }
          }
          break;
        case undefined:
          break;
      }

      return () => navigator.geolocation.clearWatch(watchId);
    },
    [clicked, status, latitude, longitude],
  );

  return (
    <MyLocationContext.Provider value={{ coords, error, onButtonClick }}>
      {props.children}
    </MyLocationContext.Provider>
  );
}
