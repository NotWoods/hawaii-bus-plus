import { MapProvider } from '@hawaii-bus-plus/react-google-maps';
import { h } from 'preact';
import { FocusTrapProvider } from './buttons/FocusTrap';
import { MainContent } from './home/MainContent';
import { googleMapOptions } from './hooks/useLoadGoogleMaps';
import { MyLocationProvider } from './map/location/context';
import { MainMap } from './map/MainMap';
import { Router } from './router/Router';
import { RouteDetailProvider } from './routes/timetable/context';
import { StickySnackbarProvider } from './snackbar/context';
import { StickySnackbars } from './snackbar/StickySnackbars';

export function Main() {
  return (
    <main class="main">
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
        <RouteDetailProvider>
          <StickySnackbarProvider>
            <FocusTrapProvider>
              <MapProvider options={googleMapOptions}>
                <Main />
              </MapProvider>
            </FocusTrapProvider>
          </StickySnackbarProvider>
        </RouteDetailProvider>
      </MyLocationProvider>
    </Router>
  );
}
