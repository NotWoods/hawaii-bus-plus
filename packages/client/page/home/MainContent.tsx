import {
  BikeStationPoint,
  PlacePoint,
  Point,
  StopPoint,
} from '@hawaii-bus-plus/presentation';
import { Fragment, h } from 'preact';
import { useContext } from 'preact/hooks';
import { useLazyComponent, useScreens } from '../hooks';
import { MyLocationButton } from '../map/location/MyLocationButton';
import { RouterContext } from '../router/Router';
import { DIRECTIONS_PATH } from '../router/state';
import { RouteTimetable } from '../routes/RouteTimetable';
import { PointDetails } from '../stop/PointDetails';
import { HomeOverlay } from './HomeOverlay';

function pointDetailsOpen(
  point: Point | undefined,
): point is StopPoint | PlacePoint | BikeStationPoint {
  switch (point?.type) {
    case 'stop':
    case 'place':
    case 'bike':
      return true;
    default:
      return false;
  }
}

export function MainContent() {
  const mdMatches = useScreens('md');
  const { JourneySheet } = useLazyComponent(
    () => import('../directions/JourneySheet'),
  );
  const { point, main } = useContext(RouterContext);
  const sheetOpen = main != undefined;

  function renderOverlay() {
    if (pointDetailsOpen(point)) {
      return <PointDetails point={point} />;
    } else {
      return <HomeOverlay />;
    }
  }

  function renderSheet() {
    if (JourneySheet && main?.path === DIRECTIONS_PATH && main.journey) {
      return (
        <JourneySheet journey={main.journey} timeZone="Pacific/Honolulu" />
      );
    } else {
      return <RouteTimetable />;
    }
  }

  if (mdMatches) {
    // Medium or bigger
    return (
      <>
        <MyLocationButton shiftUp={sheetOpen} />
        {renderOverlay()}
        {renderSheet()}
      </>
    );
  } else {
    // Small screen
    return (
      <>
        <MyLocationButton shiftUp={sheetOpen} />
        {pointDetailsOpen(point) || !sheetOpen
          ? renderOverlay()
          : renderSheet()}
      </>
    );
  }
}
