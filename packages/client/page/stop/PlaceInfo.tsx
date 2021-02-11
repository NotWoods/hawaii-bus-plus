import { h } from 'preact';
import { useState } from 'preact/hooks';
import type { NearbyWorkerHandler } from '../../worker-nearby/nearby';
import NearbyWorker from '../../worker-nearby/nearby?worker';
import { databaseInitialized } from '../hooks/useDatabaseInitialized';
import { usePromise } from '../hooks/usePromise';
import { useWorker } from '../hooks/useWorker';
import { emptyClosestResults } from './PlaceCard';
import { PointInfo } from './PointInfo';

interface Props {
  position: google.maps.LatLngLiteral;
}

export function PlaceInfo({ position }: Props) {
  const [results, setResults] = useState(emptyClosestResults);
  const postToNearbyWorker = useWorker(NearbyWorker) as NearbyWorkerHandler;

  usePromise(async () => {
    await databaseInitialized;
    const results = await postToNearbyWorker({
      type: 'closest-stop',
      location: position,
      fallbackToAll: false,
    });
    setResults(results);
  }, [position]);

  return (
    <PointInfo
      {...results}
      stopsTitle="Nearby stops"
      routesTitle="Nearby routes"
    />
  );
}
