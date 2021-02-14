import {
  BikeStationPoint,
  PlacePointPartial,
  StopPoint,
} from '@hawaii-bus-plus/presentation';
import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { LoadingBar } from '../buttons/LoadingBar';
import { useLazyComponent } from '../hooks/useLazyComponent';
import { closeStopAction } from '../router/action';
import { RouterContext } from '../router/Router';
import { SearchBase } from '../search/SearchBase';

interface Props {
  point: StopPoint | PlacePointPartial | BikeStationPoint;
}

export function PointDetails({ point }: Props) {
  const { dispatch } = useContext(RouterContext);
  const { StopCard, PlaceCard, BikeStationCard } = useLazyComponent(
    () => import('./card-lazy-entry')
  );

  function onClose() {
    dispatch(closeStopAction());
  }

  switch (point.type) {
    case 'stop':
      if (StopCard) {
        return (
          <SearchBase onClose={onClose}>
            <StopCard point={point} />
          </SearchBase>
        );
      }
      break;
    case 'place':
      if (PlaceCard) {
        return (
          <SearchBase onClose={onClose}>
            <PlaceCard point={point} />
          </SearchBase>
        );
      }
      break;
    case 'bike':
      if (BikeStationCard) {
        return (
          <SearchBase onClose={onClose}>
            <BikeStationCard point={point} />
          </SearchBase>
        );
      }
      break;
  }
  return (
    <SearchBase onClose={onClose}>
      <LoadingBar />
    </SearchBase>
  );
}
