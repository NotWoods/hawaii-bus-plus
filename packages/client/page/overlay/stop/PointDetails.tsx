import {
  BikeStationPoint,
  PlacePointPartial,
  StopPoint,
} from '@hawaii-bus-plus/presentation';
import { memoize } from '@hawaii-bus-plus/utils';
import { h } from 'preact';
import { useLazyComponent } from '../../hooks';
import { LoadingBusIcon } from '../../loading/LoadingBusIcon';
import { closePointAction } from '../../router/action/point';
import { useDispatch } from '../../router/hooks';
import { SearchBase } from '../search/SearchBase';

interface Props {
  point: StopPoint | PlacePointPartial | BikeStationPoint;
}

const cardImport = memoize(() => import('./card-lazy-entry'));

export function PointDetails({ point }: Props) {
  const dispatch = useDispatch();
  const { StopCard, PlaceCard, BikeStationCard } = useLazyComponent(cardImport);

  function onClose() {
    dispatch(closePointAction());
  }

  switch (point.type) {
    case 'stop':
      if (StopCard) {
        return (
          <SearchBase onButtonClick={onClose}>
            <StopCard point={point} />
          </SearchBase>
        );
      }
      break;
    case 'place':
      if (PlaceCard) {
        return (
          <SearchBase onButtonClick={onClose}>
            <PlaceCard point={point} />
          </SearchBase>
        );
      }
      break;
    case 'bike':
      if (BikeStationCard) {
        return (
          <SearchBase onButtonClick={onClose}>
            <BikeStationCard point={point} />
          </SearchBase>
        );
      }
      break;
  }
  return (
    <SearchBase onButtonClick={onClose}>
      <LoadingBusIcon />
    </SearchBase>
  );
}
