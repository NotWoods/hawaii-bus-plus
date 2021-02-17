import { Auth0Provider } from '@auth0/auth0-react';
import { MapProvider } from '@hawaii-bus-plus/react-google-maps';
import { h } from 'preact';
import './App.css';
import { FocusTrapProvider } from './buttons/FocusTrap';
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
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN as string}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID as string}
      redirectUri={window.location.origin}
    >
      <Router>
        <ApiProvider>
          <MyLocationProvider>
            <RouteDetailProvider>
              <StickySnackbarProvider>
                <FocusTrapProvider>
                  <MapProvider options={googleMapOptions}>
                    <main class="main">
                      <MainMap />
                      <MainContent />
                      <StickySnackbars />
                    </main>
                  </MapProvider>
                </FocusTrapProvider>
              </StickySnackbarProvider>
            </RouteDetailProvider>
          </MyLocationProvider>
        </ApiProvider>
      </Router>
    </Auth0Provider>
  );
}
