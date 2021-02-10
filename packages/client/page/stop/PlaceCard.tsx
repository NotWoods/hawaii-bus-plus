import { PlacePointPartial } from '@hawaii-bus-plus/presentation';
import { h } from 'preact';
import { useState } from 'preact/hooks';
import { usePlacesService } from '../hooks/usePlacesService';
import { usePromise } from '../hooks/usePromise';
import { PlaceResult } from '../router/reducer';
import { buildSessionToken } from '../search/simple/places-autocomplete';
import { PointBase } from './PointBase';
import { PointDescription, PointHeader } from './PointInfo';

interface Props {
  point: PlacePointPartial;
  onClose(): void;
}

export function PlaceCard({ point, onClose }: Props) {
  const getPlaceDetails = usePlacesService();
  const [details, setDetails] = useState<PlaceResult | undefined>();

  usePromise(async () => {
    setDetails(undefined);
    if (getPlaceDetails) {
      const details = await getPlaceDetails({
        placeId: point.placeId,
        fields: ['formatted_address', 'name', 'geometry', 'place_id'],
        sessionToken: buildSessionToken(),
      });
      setDetails(details);
    }
  }, [getPlaceDetails, point.placeId]);

  const position = point.position ?? details?.location;
  if (position) {
    return (
      <PointBase position={position} onClose={onClose}>
        <PointHeader>{point.name ?? details?.name}</PointHeader>
        <PointDescription>{details?.formatted_address}</PointDescription>
      </PointBase>
    );
  } else {
    return null;
  }
}
