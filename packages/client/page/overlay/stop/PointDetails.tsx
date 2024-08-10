import type {
  BikeStationPoint,
  PlacePointPartial,
  StopPoint,
} from '@hawaii-bus-plus/presentation';
import { lazy, Suspense } from 'preact/compat';

import { LoadingBusIcon } from '../../loading/LoadingBusIcon';
import { SnackbarErrorBoundary } from '../../loading/SnackbarErrorBoundary';
import { closePointAction } from '../../router/action/point';
import { useDispatch } from '../../router/hooks';
import { BaseOverlay } from '../BaseOverlay';

interface Props {
  point: StopPoint | PlacePointPartial | BikeStationPoint;
}

const cardImport = () => import('./card-lazy-entry');
const StopCard = lazy(async () => (await cardImport()).StopCard);
const PlaceCard = lazy(async () => (await cardImport()).PlaceCard);
const BikeStationCard = lazy(async () => (await cardImport()).BikeStationCard);

export function PointDetails({ point }: Props) {
  const dispatch = useDispatch();

  function onClose() {
    dispatch(closePointAction());
  }

  function renderCard() {
    switch (point.type) {
      case 'stop':
        return <StopCard point={point} />;
      case 'place':
        return <PlaceCard point={point} />;
      case 'bike':
        return <BikeStationCard point={point} />;
    }
  }

  return (
    <BaseOverlay onNavigate={onClose}>
      <SnackbarErrorBoundary fallback={null}>
        <Suspense fallback={<LoadingBusIcon />}>{renderCard()}</Suspense>
      </SnackbarErrorBoundary>
    </BaseOverlay>
  );
}
