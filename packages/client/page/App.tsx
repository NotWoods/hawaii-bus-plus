import { MapProvider } from '@hawaii-bus-plus/react-google-maps';
import { h } from 'preact';
import { googleMapOptions } from './hooks/useLoadGoogleMaps';
import { MainContent } from './MainContent';
import { MyLocationProvider } from './map/location/context';
import { MainMap } from './map/MainMap';
import { PageHead } from './PageHead';
import { Router } from './router/Router';
import { StickySnackbarProvider } from './snackbar/context';
import { StickySnackbars } from './snackbar/StickySnackbars';

export function Main() {
  return (
    <main>
      <MainMap />
      <MainContent />
      <StickySnackbars />
    </main>
  );
}

export function App(props: { initialUrl?: URL }) {
  return (
    <Router initialUrl={props.initialUrl}>
      <MyLocationProvider>
        <StickySnackbarProvider>
          <MapProvider options={googleMapOptions}>
            <PageHead />
            <Main />
          </MapProvider>
        </StickySnackbarProvider>
      </MyLocationProvider>
    </Router>
  );
}
