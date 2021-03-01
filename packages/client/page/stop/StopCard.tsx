import { StopPoint } from '@hawaii-bus-plus/presentation';
import { h } from 'preact';
import { useState } from 'preact/hooks';
import type { InfoWorkerHandler } from '../../worker-info/info';
import InfoWorker from '../../worker-info/info?worker';
import type { StopDetails } from '../../worker-info/stop-details';
import { dbInitialized } from '../hooks/api';
import { usePromise } from '../hooks/usePromise';
import { useWorker } from '../hooks/useWorker';
import { PointBase } from './PointBase';
import { PointDescription, PointHeader } from './PointInfo';
import { StopInfo } from './StopInfo';

interface Props {
  point: StopPoint;
}

export function StopCard({ point }: Props) {
  const [details, setDetails] = useState<StopDetails | undefined>();
  const postToInfoWorker = useWorker(InfoWorker) as InfoWorkerHandler;

  usePromise(
    async (signal) => {
      await dbInitialized;
      const result = await postToInfoWorker(signal, {
        type: 'stop',
        id: point.stopId,
      });
      setDetails(result);
    },
    [point.stopId]
  );

  const position = point.position ?? details?.position;
  if (position) {
    return (
      <PointBase position={position}>
        <PointHeader>{details?.stop_name}</PointHeader>
        <PointDescription>{details?.stop_desc}</PointDescription>
        {details ? <StopInfo stop={details} /> : null}
      </PointBase>
    );
  } else {
    return null;
  }
}
