import type { ColorString, Stop } from '@hawaii-bus-plus/types';
import { memo } from 'preact/compat';
import { useState } from 'preact/hooks';
import {
  MapWorker,
  type MapWorkerHandler,
  type MarkersResponse,
} from '@hawaii-bus-plus/workers/map';
import { usePromise, useWorker } from '../../hooks';
import { dbInitialized } from '../../api';
import { BikeStationMarkers } from './BikeStationMarkers';
import { StopMarkers } from './StopMarkers';

interface Props {
  highlighted?: ReadonlyMap<Stop['stop_id'], ColorString>;
  focused?: ReadonlySet<Stop['stop_id']>;
  darkMode: boolean;
}

const StopMarkersMemo = memo(StopMarkers);
const BikeStationMarkersMemo = memo(BikeStationMarkers);

export function AllMarkers({ highlighted, focused, darkMode }: Props) {
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
      <StopMarkersMemo
        stops={api.stops}
        highlighted={highlighted}
        focused={focused}
        darkMode={darkMode}
      />
      <BikeStationMarkersMemo stations={api.bikeStations} />
    </>
  );
}
