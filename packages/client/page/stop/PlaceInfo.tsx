import { h } from 'preact';
import { useState } from 'preact/hooks';
import type { NearbyWorkerHandler } from '../../worker-nearby/nearby';
import NearbyWorker from '../../worker-nearby/nearby?worker';
import { useApiKey } from '../api/hook';
import { usePromise } from '../hooks/usePromise';
import { useWorker } from '../hooks/useWorker';
import { emptyClosestResults } from '../search/simple/places-autocomplete';
import { PointInfo } from './PointInfo';

interface Props {
  position: google.maps.LatLngLiteral;
}

export function PlaceInfo({ position }: Props) {
  const [results, setResults] = useState(emptyClosestResults);
  const apiKey = useApiKey();
  const postToNearbyWorker = useWorker(NearbyWorker) as NearbyWorkerHandler;

  usePromise(
    async (signal) => {
      if (!apiKey) return;
      const results = await postToNearbyWorker(signal, {
        type: 'closest-stop',
        apiKey,
        location: position,
        fallbackToAll: false,
      });
      setResults(results);
    },
    [apiKey, position]
  );

  return (
    <PointInfo
      {...results}
      stopsTitle="Nearby stops"
      routesTitle="Nearby routes"
    />
  );
}
