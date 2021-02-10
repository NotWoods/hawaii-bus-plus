import { PlacePointPartial, StopPoint } from '@hawaii-bus-plus/presentation';
import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { closeStopAction } from '../router/action';
import { RouterContext } from '../router/Router';
import { PlaceCard } from './PlaceCard';
import { StopCard } from './StopCard';

interface Props {
  point: StopPoint | PlacePointPartial;
}

export function PointDetails({ point }: Props) {
  const { dispatch } = useContext(RouterContext);

  function onClose() {
    dispatch(closeStopAction());
  }

  switch (point.type) {
    case 'stop':
      return <StopCard point={point} onClose={onClose} />;
    case 'place':
      return <PlaceCard point={point} onClose={onClose} />;
  }
}
