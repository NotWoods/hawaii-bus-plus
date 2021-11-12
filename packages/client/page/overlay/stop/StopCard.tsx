import { StopPoint } from '@hawaii-bus-plus/presentation';
import { h } from 'preact';
import { useState } from 'preact/hooks';
import {
  InfoWorker,
  InfoWorkerHandler,
  StopDetails,
} from '../../../workers/info';
import { usePromise, useWorker } from '../../hooks';
import { dbInitialized } from '../../api';
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
    [point.stopId],
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
