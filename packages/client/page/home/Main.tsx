import { PlacePoint, Point, StopPoint } from '@hawaii-bus-plus/presentation';
import { h } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { JourneySheet } from '../directions/JourneySheet';
import { useScreens } from '../hooks/useScreens';
import { MainMap } from '../map/MainMap';
import { RouterContext } from '../router/Router';
import { RouteTimetable } from '../routes/RouteTimetable';
import { DirectionsSearch } from '../search/directions/DirectionsSearch';
import { SimpleSearch } from '../search/simple/SimpleSearch';
import { PointDetails } from '../stop/PointDetails';
import { Home } from './Home';

export function Main() {
  const smMatches = useScreens('sm');
  const { point, directions, routeId } = useContext(RouterContext);
  const [screen, setScreen] = useState<'home' | 'search' | 'directions'>(
    'home'
  );
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
      switch (screen) {
        case 'home':
          return <Home onSearch={() => setScreen('search')} />;
        case 'search':
          return (
            <SimpleSearch
              onClose={() => setScreen('home')}
              onDirections={() => setScreen('directions')}
            />
          );
        case 'directions':
          return <DirectionsSearch onClose={() => setScreen('home')} />;
      }
    }
  }

  function renderSheet() {
    return directions?.journey ? (
      <JourneySheet journey={directions.journey} timeZone="Pacific/Honolulu" />
    ) : (
      <RouteTimetable />
    );
  }

  if (smMatches) {
    // Small screen
    return (
      <main class="main">
        <MainMap />
        {pointDetailsOpen(point) || !sheetOpen
          ? renderOverlay()
          : renderSheet()}
      </main>
    );
  } else {
    // Medium or bigger
    return (
      <main class="main">
        <MainMap />
        {renderOverlay()}
        {renderSheet()}
      </main>
    );
  }
}
