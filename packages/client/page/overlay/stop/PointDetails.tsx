import type {
  BikeStationPoint,
  PlacePointPartial,
  StopPoint,
} from '@hawaii-bus-plus/presentation';
import { memoize } from '@hawaii-bus-plus/utils';

import { useLazyComponent } from '../../hooks';
import { LoadingBusIcon } from '../../loading/LoadingBusIcon';
import { closePointAction } from '../../router/action/point';
import { useDispatch } from '../../router/hooks';
import { BaseOverlay } from '../BaseOverlay';

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
          <BaseOverlay onNavigate={onClose}>
            <StopCard point={point} />
          </BaseOverlay>
        );
      }
      break;
    case 'place':
      if (PlaceCard) {
        return (
          <BaseOverlay onNavigate={onClose}>
            <PlaceCard point={point} />
          </BaseOverlay>
        );
      }
      break;
    case 'bike':
      if (BikeStationCard) {
        return (
          <BaseOverlay onNavigate={onClose}>
            <BikeStationCard point={point} />
          </BaseOverlay>
        );
      }
      break;
  }
  return (
    <BaseOverlay onNavigate={onClose}>
      <LoadingBusIcon />
    </BaseOverlay>
  );
}
