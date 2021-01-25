import { center } from '@hawaii-bus-plus/react-google-maps';
import { Stop } from '@hawaii-bus-plus/types';
import React, { useContext, useState } from 'react';
import InfoWorker from '../../worker-info/info?worker';
import type { StopDetails } from '../../worker-info/stop-details';
import { usePromise } from '../hooks/usePromise';
import { useWorker } from '../hooks/useWorker';
import { closeStopAction } from '../router/action';
import { PlaceResult } from '../router/reducer';
import { RouterContext } from '../router/Router';
import { PlaceInfo, StopInfo } from './StopInfo';
import { StreetViewCard } from './StreetViewCard';

export function StopOrPlaceCard() {
  const { focus, stop_id, place_id, marker, dispatch } = useContext(
    RouterContext
  );

  function onClose() {
    dispatch(closeStopAction());
  }

  switch (focus) {
    case 'stop':
      return <StopCard stopId={stop_id as Stop['stop_id']} onClose={onClose} />;
    case 'place':
      return <PlaceCard placeId={place_id!} onClose={onClose} />;
    case 'user':
    case 'marker':
      return <StreetViewCard position={marker!} visible onClose={onClose} />;
    case undefined:
      return null;
  }
}

interface BaseCardProps {
  position?: google.maps.LatLngLiteral;
  onClose(): void;
}

function StopCard(props: { stopId: Stop['stop_id'] } & BaseCardProps) {
  const [details, setDetails] = useState<StopDetails | undefined>();
  const postToInfoWorker = useWorker(InfoWorker)!;

  usePromise(async () => {
    const result = await postToInfoWorker({
      type: 'stop',
      id: props.stopId,
    });
    setDetails(result as StopDetails | undefined);
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

function PlaceCard(props: { placeId: string } & BaseCardProps) {
  const [details, setDetails] = useState<PlaceResult | undefined>();
  const postToInfoWorker = useWorker(InfoWorker)!;

  usePromise(async () => {
    const result = await postToInfoWorker({
      type: 'place',
      id: props.placeId,
    });
    setDetails(result as PlaceResult | undefined);
  }, [props.placeId]);

  const position = props.position || details?.location;
  if (position) {
    return (
      <StreetViewCard
        position={position || center}
        visible={Boolean(position)}
        onClose={props.onClose}
      >
        <PlaceInfo place={details} />
      </StreetViewCard>
    );
  } else {
    return null;
  }
}
