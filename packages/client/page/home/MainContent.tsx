import { PlacePoint, Point, StopPoint } from '@hawaii-bus-plus/presentation';
import { h, Fragment } from 'preact';
import { useContext } from 'preact/hooks';
import { useLazyComponent } from '../hooks/useLazyComponent';
import { useScreens } from '../hooks/useScreens';
import { MyLocationButton } from '../map/location/MyLocationButton';
import { RouterContext } from '../router/Router';
import { RouteTimetable } from '../routes/RouteTimetable';
import { PointDetails } from '../stop/PointDetails';
import { HomeOverlay } from './HomeOverlay';

export function MainContent() {
  const mdMatches = useScreens('md');
  const { JourneySheet } = useLazyComponent(
    () => import('../directions/JourneySheet')
  );
  const { point, directions, routeId } = useContext(RouterContext);
  const sheetOpen = directions != undefined || routeId != undefined;

  function pointDetailsOpen(
    point: Point | undefined
  ): point is StopPoint | PlacePoint {
    switch (point?.type) {
      case 'stop':
      case 'place':
        return true;
      default:
        return false;
    }
  }

  function renderOverlay() {
    if (pointDetailsOpen(point)) {
      return <PointDetails point={point} />;
    } else {
      return <HomeOverlay />;
    }
  }

  function renderSheet() {
    return JourneySheet && directions?.journey ? (
      <JourneySheet journey={directions.journey} timeZone="Pacific/Honolulu" />
    ) : (
      <RouteTimetable />
    );
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
