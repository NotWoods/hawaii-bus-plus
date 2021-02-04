import { useGoogleMap } from '@hawaii-bus-plus/react-google-maps';
import { memoize } from '@hawaii-bus-plus/utils';

const buildPlacesService = memoize(
  (map: google.maps.Map) => new google.maps.places.PlacesService(map)
);

function getDetails(
  service: google.maps.places.PlacesService,
  request: google.maps.places.PlaceDetailsRequest
) {
  return new Promise<google.maps.places.PlaceResult>((resolve, reject) =>
    service.getDetails(request, (result, status) => {
      switch (status) {
        case google.maps.places.PlacesServiceStatus.OK:
          return resolve(result);
        default:
          return reject(status);
      }
    })
  );
}

export function usePlacesService() {
  const map = useGoogleMap();
  const placesService = map && buildPlacesService(map);
  if (placesService) {
    return (request: google.maps.places.PlaceDetailsRequest) =>
      getDetails(placesService, request);
  } else {
    return undefined;
  }
}
