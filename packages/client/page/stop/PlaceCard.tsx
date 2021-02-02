import { center, useGoogleMap } from '@hawaii-bus-plus/react-google-maps';
import { memoize } from '@hawaii-bus-plus/utils';
import { h } from 'preact';
import { useState } from 'preact/hooks';
import { usePromise } from '../hooks/usePromise';
import { PlaceResult } from '../router/reducer';
import { buildSessionToken } from '../sidebar/search/places-autocomplete';
import { PlaceInfo } from './StopInfo';
import { StreetViewCard } from './StreetViewCard';

interface Props {
  position?: google.maps.LatLngLiteral;
  placeId: string;
  onClose(): void;
}

const buildService = memoize(
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

export function PlaceCard(props: Props) {
  const map = useGoogleMap();
  const [details, setDetails] = useState<PlaceResult | undefined>();

  usePromise(async () => {
    setDetails(undefined);
    if (map) {
      const service = buildService(map);
      const details = await getDetails(service, {
        placeId: props.placeId,
        fields: ['formatted_address', 'name', 'geometry', 'place_id'],
        sessionToken: buildSessionToken(),
      });
      setDetails(details);
    }
  }, [map, props.placeId]);

  const position = props.position ?? details?.location;
  if (position) {
    return (
      <StreetViewCard
        position={position || center}
        visible={Boolean(position)}
        onClose={props.onClose}
      >
        <PlaceInfo place={details} />
      </StreetViewCard>
    );
  } else {
    return null;
  }
}
