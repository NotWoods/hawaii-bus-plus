import { h, ComponentChildren, createContext } from 'preact';
import { useState } from 'preact/hooks';
import {
  GeolocationErrorCode,
  usePermission,
} from '../../hooks/useGeolocation';
import { useAbortEffect } from '../../hooks/usePromise';
import { locationFromIp } from './ipstack';

export type Coordinates = Pick<
  GeolocationCoordinates,
  'latitude' | 'longitude'
>;

interface MyLocationContext {
  coords?: Coordinates;
  error?: GeolocationErrorCode;
  onButtonClick(): void;
}

export const MyLocationContext = createContext<MyLocationContext>({
  error: GeolocationErrorCode.NOT_YET_LOADED,
  onButtonClick() {},
});

export function MyLocationProvider(props: { children: ComponentChildren }) {
  const status = usePermission({ name: 'geolocation' });
  const [clicked, setClicked] = useState(false);
  const [coords, setCoordinates] = useState<Coordinates | undefined>();
  const [error, setError] = useState<GeolocationErrorCode | undefined>(
    GeolocationErrorCode.NOT_YET_LOADED
  );

  function onFetchSuccess(coords: Coordinates) {
    setCoordinates(coords);
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
        if (!coords) {
          locationFromIp(signal).then(onFetchSuccess, () =>
            setError((currentErr) => {
              if (err) {
                return err.code as GeolocationErrorCode;
              } else {
                return currentErr;
              }
            })
          );
        }
      }

      switch (status) {
        case 'granted':
          // Already granted, just grab location
          watchId = navigator.geolocation.watchPosition(
            onGeolocationSuccess,
            fallbackGeolocation
          );
          break;
        case 'prompt':
          if (clicked) {
            watchId = navigator.geolocation.watchPosition(
              onGeolocationSuccess,
              fallbackGeolocation
            );
          } else {
            fallbackGeolocation();
          }
          break;
        case 'denied':
          if (!coords) {
            fallbackGeolocation();
            if (clicked) {
              // TODO tell user geolocation is denied
            }
          }
          break;
      }

      return () => navigator.geolocation.clearWatch(watchId);
    },
    [clicked, status, coords]
  );

  function onButtonClick() {
    setClicked(true);
  }

  return (
    <MyLocationContext.Provider value={{ coords, error, onButtonClick }}>
      {props.children}
    </MyLocationContext.Provider>
  );
}
