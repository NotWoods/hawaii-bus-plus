import {
  errorAction,
  foundCoordinatesAction,
  GeolocationErrorCode,
} from './action';
import { locationReducer } from './reducer';

test('found coordinates', () => {
  expect(
    locationReducer(
      {},
      foundCoordinatesAction({ latitude: 10, longitude: 10 }),
    ),
  ).toEqual({
    error: undefined,
    coords: { lat: 10, lng: 10 },
  });

  expect(
    locationReducer(
      {},
      foundCoordinatesAction({ latitude: null, longitude: 100 }),
    ),
  ).toEqual({
    coords: undefined,
    error: GeolocationErrorCode.POSITION_UNAVAILABLE,
  });
  expect(
    locationReducer(
      { coords: { lat: 10, lng: 10 } },
      foundCoordinatesAction({ latitude: 100, longitude: null }),
    ),
  ).toEqual({
    coords: { lat: 10, lng: 10 },
    error: GeolocationErrorCode.POSITION_UNAVAILABLE,
  });
  expect(locationReducer({}, foundCoordinatesAction({}))).toEqual({
    coords: undefined,
    error: GeolocationErrorCode.POSITION_UNAVAILABLE,
  });
});

test('error', () => {
  expect(locationReducer({}, errorAction())).toEqual({});
  expect(
    locationReducer(
      {},
      errorAction({
        code: GeolocationErrorCode.PERMISSION_DENIED,
      } as GeolocationPositionError),
    ),
  ).toEqual({ error: GeolocationErrorCode.PERMISSION_DENIED });
});
