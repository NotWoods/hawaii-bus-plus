import { createContext, type ComponentChildren } from 'preact';
import { useCallback, useMemo, useReducer, useState } from 'preact/hooks';
import { useAbortEffect, usePermission } from '../../hooks';
import { errorAction, foundCoordinatesAction } from './action';
import { locationFromIp, type Coordinates } from './ipstack';
import { locationReducer } from './reducer';
import { GeolocationErrorCode, type LocationState } from './state';

interface MyLocationContext extends LocationState {
  onButtonClick(): void;
}

export const MyLocationContext = createContext<MyLocationContext>({
  error: GeolocationErrorCode.NOT_YET_LOADED,
  onButtonClick() {},
});

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
        case 'unknown':
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

  const value = useMemo(
    () => Object.assign({}, state, { onButtonClick }),
    [state, onButtonClick],
  );

  return (
    <MyLocationContext.Provider value={value}>
      {props.children}
    </MyLocationContext.Provider>
  );
}
