import { ColorString, Stop } from '@hawaii-bus-plus/types';
import { Fragment, h } from 'preact';
import { useContext } from 'preact/hooks';
import { useState } from 'react';
import type { MapWorkerHandler } from '../../../worker-map/map';
import MapWorker from '../../../worker-map/map?worker';
import type { MarkersResponse } from '../../../worker-map/markers';
import { usePromise, useWorker } from '../../hooks';
import { dbInitialized } from '../../hooks/api';
import { RouterContext } from '../../router/Router';
import { BikeStationMarkers } from './BikeStationMarkers';
import { StopMarkers } from './StopMarkers';

interface Props {
  highlighted?: ReadonlyMap<Stop['stop_id'], ColorString>;
  focused?: ReadonlySet<Stop['stop_id']>;
  darkMode?: boolean;
}

export function StopStationMarkers({ highlighted, focused, darkMode }: Props) {
  const { dispatch, point } = useContext(RouterContext);
  const [api, setApi] = useState<MarkersResponse>({
    stops: [],
    bikeStations: [],
  });
  const postToInfoWorker = useWorker(MapWorker) as MapWorkerHandler;

  usePromise(async (signal) => {
    await dbInitialized;
    const api = await postToInfoWorker(signal, { type: 'markers' });
    setApi(api);
  }, []);

  return (
    <>
      <StopMarkers
        stops={api.stops}
        highlighted={highlighted}
        focused={focused}
        darkMode={darkMode}
        point={point}
        dispatch={dispatch}
      />
      <BikeStationMarkers
        stations={api.bikeStations}
        point={point}
        dispatch={dispatch}
      />
    </>
  );
}
