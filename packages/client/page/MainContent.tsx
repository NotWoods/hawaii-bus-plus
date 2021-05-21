import { Fragment, h } from 'preact';
import { useContext } from 'preact/hooks';
import { useScreens } from './hooks';
import { MyLocationButton } from './map/location/MyLocationButton';
import { MainOverlay } from './overlay/MainOverlay';
import { RouterContext } from './router/Router';
import { MainSheet } from './sheet/MainSheet';

export function MainContent() {
  const mdMatches = useScreens('md');
  const state = useContext(RouterContext);
  const sheetOpen = state.main != undefined;

  const floatingActionButton = <MyLocationButton shiftUp={sheetOpen} />;

  if (mdMatches) {
    // Medium or bigger
    return (
      <>
        {floatingActionButton}
        <MainOverlay />
        <MainSheet />
      </>
    );
  } else {
    // Small screen
    return (
      <>
        {floatingActionButton}
        {state.last === 'point' ? <MainOverlay /> : <MainSheet />}
      </>
    );
  }
}
