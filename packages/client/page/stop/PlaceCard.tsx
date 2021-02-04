import { center } from '@hawaii-bus-plus/react-google-maps';
import { h } from 'preact';
import { useState } from 'preact/hooks';
import { usePlacesService } from '../hooks/usePlacesService';
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

export function PlaceCard(props: Props) {
  const getPlaceDetails = usePlacesService();
  const [details, setDetails] = useState<PlaceResult | undefined>();

  usePromise(async () => {
    setDetails(undefined);
    if (getPlaceDetails) {
      const details = await getPlaceDetails({
        placeId: props.placeId,
        fields: ['formatted_address', 'name', 'geometry', 'place_id'],
        sessionToken: buildSessionToken(),
      });
      setDetails(details);
    }
  }, [getPlaceDetails, props.placeId]);

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
