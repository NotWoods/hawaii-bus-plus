import { center } from '@hawaii-bus-plus/react-google-maps';
import { Stop } from '@hawaii-bus-plus/types';
import React, { useState } from 'react';
import { InfoWorkerHandler } from '../../worker-info/info';
import InfoWorker from '../../worker-info/info?worker';
import type { StopDetails } from '../../worker-info/stop-details';
import { databaseInitialized } from '../hooks/useDatabaseInitialized';
import { usePromise } from '../hooks/usePromise';
import { useWorker } from '../hooks/useWorker';
import { StopInfo } from './StopInfo';
import { StreetViewCard } from './StreetViewCard';

interface Props {
  position?: google.maps.LatLngLiteral;
  stopId: Stop['stop_id'];
  onClose(): void;
}

export function StopCard(props: Props) {
  const [details, setDetails] = useState<StopDetails | undefined>();
  const postToInfoWorker = useWorker(InfoWorker) as InfoWorkerHandler;

  usePromise(async () => {
    await databaseInitialized;
    const result = await postToInfoWorker({
      type: 'stop',
      id: props.stopId,
    });
    setDetails(result);
  }, [props.stopId]);

  const position = props.position || details?.position;
  if (position) {
    return (
      <StreetViewCard
        position={position || center}
        visible={Boolean(position)}
        onClose={props.onClose}
      >
        <StopInfo stop={details} />
      </StreetViewCard>
    );
  } else {
    return null;
  }
}
