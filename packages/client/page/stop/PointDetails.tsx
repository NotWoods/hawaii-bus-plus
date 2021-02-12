import { PlacePointPartial, StopPoint } from '@hawaii-bus-plus/presentation';
import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { LoadingBar } from '../buttons/LoadingBar';
import { useLazyComponent } from '../hooks/useLazyComponent';
import { closeStopAction } from '../router/action';
import { RouterContext } from '../router/Router';
import { SearchBase } from '../search/SearchBase';

interface Props {
  point: StopPoint | PlacePointPartial;
}

export function PointDetails({ point }: Props) {
  const { dispatch } = useContext(RouterContext);
  const { StopCard, PlaceCard } = useLazyComponent(
    () => import('./card-lazy-entry')
  );

  function onClose() {
    dispatch(closeStopAction());
  }

  switch (point.type) {
    case 'stop':
      if (StopCard) {
        return <StopCard point={point} onClose={onClose} />;
      }
      break;
    case 'place':
      if (PlaceCard) {
        return <PlaceCard point={point} onClose={onClose} />;
      }
      break;
  }
  return (
    <SearchBase onClose={onClose}>
      <LoadingBar />
    </SearchBase>
  );
}
