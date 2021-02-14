import { MapProvider } from '@hawaii-bus-plus/react-google-maps';
import { h } from 'preact';
import './App.css';
import { MainContent } from './home/MainContent';
import { ApiProvider } from './hooks/useApi';
import { googleMapOptions } from './hooks/useLoadGoogleMaps';
import { MyLocationProvider } from './map/location/context';
import { MainMap } from './map/MainMap';
import { Router } from './router/Router';
import { RouteDetailProvider } from './routes/timetable/context';
import { StickySnackbarProvider } from './snackbar/context';
import { StickySnackbars } from './snackbar/StickySnackbars';

export function App() {
  return (
    <Router>
      <ApiProvider>
        <MyLocationProvider>
          <RouteDetailProvider>
            <StickySnackbarProvider>
              <MapProvider options={googleMapOptions}>
                <main class="main">
                  <MainMap />
                  <MainContent />
                  <StickySnackbars />
                </main>
              </MapProvider>
            </StickySnackbarProvider>
          </RouteDetailProvider>
        </MyLocationProvider>
      </ApiProvider>
    </Router>
  );
}
