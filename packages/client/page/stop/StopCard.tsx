import { StopPoint } from '@hawaii-bus-plus/presentation';
import { h } from 'preact';
import { useState } from 'preact/hooks';
import { InfoWorkerHandler } from '../../worker-info/info';
import InfoWorker from '../../worker-info/info?worker';
import type { StopDetails } from '../../worker-info/stop-details';
import { databaseInitialized } from '../hooks/useDatabaseInitialized';
import { usePromise } from '../hooks/usePromise';
import { useWorker } from '../hooks/useWorker';
import { PointBase } from './PointBase';
import { PointDescription, PointHeader } from './PointInfo';
import { StopInfo } from './StopInfo';

interface Props {
  point: StopPoint;
  onClose(): void;
}

export function StopCard({ point, onClose }: Props) {
  const [details, setDetails] = useState<StopDetails | undefined>();
  const postToInfoWorker = useWorker(InfoWorker) as InfoWorkerHandler;

  usePromise(async () => {
    await databaseInitialized;
    const result = await postToInfoWorker({
      type: 'stop',
      id: point.stopId,
    });
    setDetails(result);
  }, [point.stopId]);

  const position = point.position ?? details?.position;
  if (position) {
    return (
      <PointBase position={position} onClose={onClose}>
        <PointHeader>{details?.stop_name}</PointHeader>
        <PointDescription>{details?.stop_desc}</PointDescription>
        {details ? <StopInfo stop={details} /> : null}
      </PointBase>
    );
  } else {
    return null;
  }
}
