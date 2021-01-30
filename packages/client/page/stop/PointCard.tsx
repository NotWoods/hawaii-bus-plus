import React, { useContext } from 'react';
import { closeStopAction } from '../router/action';
import { RouterContext } from '../router/Router';
import { PlaceCard } from './PlaceCard';
import { StopCard } from './StopCard';
import { StreetViewCard } from './StreetViewCard';

export function PointCard() {
  const { dispatch, point } = useContext(RouterContext);

  function onClose() {
    dispatch(closeStopAction());
  }

  switch (point?.type) {
    case 'stop':
      return <StopCard stopId={point.stopId} onClose={onClose} />;
    case 'place':
      return (
        <PlaceCard
          placeId={point.placeId}
          position={point.position}
          onClose={onClose}
        />
      );
    case 'user':
    case 'marker':
      return (
        <StreetViewCard position={point.position} visible onClose={onClose} />
      );
    case undefined:
      return null;
  }
}
