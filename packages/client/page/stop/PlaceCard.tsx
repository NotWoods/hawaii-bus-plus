import { PlacePointPartial } from '@hawaii-bus-plus/presentation';
import { h } from 'preact';
import { useState } from 'preact/hooks';
import type { ClosestResults } from '../../worker-nearby/closest/closest';
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
  onClose(): void;
}

export const emptyClosestResults: ClosestResults = {
  stops: [],
  routes: new Map(),
  agencies: new Map(),
};

export function PlaceCard({ point, onClose }: Props) {
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
      <PointBase position={position} onClose={onClose}>
        <PointHeader>{point.name ?? details?.name}</PointHeader>
        <PointDescription>{details?.formatted_address}</PointDescription>
        <PlaceInfo position={position} />
      </PointBase>
    );
  } else {
    return null;
  }
}
