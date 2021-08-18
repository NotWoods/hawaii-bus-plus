import { h } from 'preact';
import { useState } from 'preact/hooks';
import { LatLngLiteral } from 'spherical-geometry-js';
import type { NearbyWorkerHandler } from '../../../worker-nearby/worker-nearby';
import NearbyWorker from '../../../worker-nearby/worker-nearby?worker';
import { dbInitialized } from '../../api';
import { usePromise, useWorker } from '../../hooks';
import { emptyClosestResults } from '../search/simple/places-autocomplete';
import { PointInfo } from './PointInfo';

interface Props {
  position: LatLngLiteral;
}

export function PlaceInfo({ position }: Props) {
  const [results, setResults] = useState(emptyClosestResults);
  const postToNearbyWorker = useWorker(NearbyWorker) as NearbyWorkerHandler;

  usePromise(
    async (signal) => {
      await dbInitialized;
      const results = await postToNearbyWorker(signal, {
        location: position,
        fallbackToAll: false,
      });
      setResults(results);
    },
    [position],
  );

  return (
    <PointInfo
      {...results}
      stopsTitle="Nearby stops"
      routesTitle="Nearby routes"
    />
  );
}
