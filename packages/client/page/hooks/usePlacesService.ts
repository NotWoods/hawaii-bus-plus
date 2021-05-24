import { useGoogleMap } from '@hawaii-bus-plus/react-google-maps';
import { memoize } from '@hawaii-bus-plus/utils';

export class PlacesServiceError extends Error {
  constructor(readonly code: google.maps.places.PlacesServiceStatus) {
    super(code);
  }
}

const buildPlacesService = memoize(
  (map: google.maps.Map) => new google.maps.places.PlacesService(map),
);

export function getDetails(
  service: google.maps.places.PlacesService,
  request: google.maps.places.PlaceDetailsRequest,
) {
  return new Promise<google.maps.places.PlaceResult>((resolve, reject) =>
    service.getDetails(request, (result, status) => {
      switch (status) {
        case google.maps.places.PlacesServiceStatus.OK:
          return resolve(result!);
        default:
          return reject(new PlacesServiceError(status));
      }
    }),
  );
}

export function usePlacesService() {
  const map = useGoogleMap();
  return map ? buildPlacesService(map) : undefined;
}
