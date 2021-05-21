import { Fragment, h } from 'preact';
import { useContext } from 'preact/hooks';
import { useLazyComponent, useScreens } from '../../hooks';
import { MyLocationButton } from '../../map/location/MyLocationButton';
import { useSelector } from '../../router/hooks';
import { RouterContext } from '../../router/Router';
import { selectPointDetailsOpen } from '../../router/selector/point';
import { DIRECTIONS_PATH, MainState } from '../../router/state';
import { RouteTimetable } from '../../routes/RouteTimetable';
import { PointDetails } from '../stop/PointDetails';
import { HomeOverlay } from './HomeOverlay';

function MainOverlay() {
  const openPoint = useSelector(selectPointDetailsOpen);

  if (openPoint) {
    return <PointDetails point={openPoint} />;
  } else {
    return <HomeOverlay />;
  }
}

function MainSheet({ main }: { main?: MainState }) {
  const { ConnectedJourneySheet } = useLazyComponent(
    () => import('../../directions/JourneySheet'),
  );

  if (ConnectedJourneySheet && main?.path === DIRECTIONS_PATH) {
    return <ConnectedJourneySheet timeZone="Pacific/Honolulu" />;
  } else {
    return <RouteTimetable />;
  }
}

export function MainContent() {
  const mdMatches = useScreens('md');
  const state = useContext(RouterContext);
  const sheetOpen = state.main != undefined;

  if (mdMatches) {
    // Medium or bigger
    return (
      <>
        <MyLocationButton shiftUp={sheetOpen} />
        <MainOverlay />
        <MainSheet />
      </>
    );
  } else {
    // Small screen
    return (
      <>
        <MyLocationButton shiftUp={sheetOpen} />
        {state.last === 'point' ? <MainOverlay /> : <MainSheet />}
      </>
    );
  }
}
