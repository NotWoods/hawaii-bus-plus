import { PlacePointPartial } from '@hawaii-bus-plus/presentation';
import { h } from 'preact';
import { useState } from 'preact/hooks';
import {
  getDetails,
  PlacesServiceError,
  usePlacesService,
} from '../hooks/usePlacesService';
import { usePromise } from '../hooks/usePromise';
import { PlaceResult } from '../router/reducer';
import { buildSessionToken } from '../search/simple/places-autocomplete';
import { PlaceInfo } from './PlaceInfo';
import { PointBase } from './PointBase';
import { PointDescription, PointHeader } from './PointInfo';

interface Props {
  point: PlacePointPartial;
}

export function PlaceCard({ point }: Props) {
  const service = usePlacesService();
  const [details, setDetails] = useState<PlaceResult | undefined>();

  usePromise(async () => {
    setDetails(undefined);
    if (service) {
      try {
        const details = await getDetails(service, {
          placeId: point.placeId,
          fields: ['formatted_address', 'name', 'geometry', 'place_id'],
          sessionToken: buildSessionToken(),
        });
        console.log(details);
        setDetails(details);
      } catch (err: unknown) {
        if (err instanceof PlacesServiceError) {
          setDetails({ place_id: point.placeId, name: '' });
        } else {
          throw err;
        }
      }
    }
  }, [service, point.placeId]);

  const position = point.position ?? details?.location;
  if (position) {
    return (
      <PointBase position={position}>
        <PointHeader>{point.name ?? details?.name}</PointHeader>
        <PointDescription>{details?.formatted_address}</PointDescription>
        <PlaceInfo position={position} />
      </PointBase>
    );
  } else {
    return null;
  }
}
