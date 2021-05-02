import { ComponentChildren, createContext, h } from 'preact';
import { useCallback, useMemo, useReducer, useState } from 'preact/hooks';
import { useAbortEffect, usePermission } from '../../hooks';
import {
  Coordinates,
  errorAction,
  foundCoordinatesAction,
  GeolocationErrorCode,
} from './action';
import { locationFromIp } from './ipstack';
import { locationReducer } from './reducer';

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
  const [state, dispatch] = useReducer(locationReducer, {});

  const onButtonClick = useCallback(() => setClicked(true), []);

  function onFetchSuccess(coords: Coordinates) {
    dispatch(foundCoordinatesAction(coords));
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
        if (!state.coords) {
          locationFromIp(signal).then(onFetchSuccess, () =>
            dispatch(errorAction(err)),
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
          if (!state.coords) {
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
    [clicked, status, state.coords],
  );

  const value = useMemo(() => ({ ...state, onButtonClick }), [
    state,
    onButtonClick,
  ]);

  return (
    <MyLocationContext.Provider value={value}>
      {props.children}
    </MyLocationContext.Provider>
  );
}
