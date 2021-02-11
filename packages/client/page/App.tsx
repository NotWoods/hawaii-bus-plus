import { MapProvider } from '@hawaii-bus-plus/react-google-maps';
import { h } from 'preact';
import { MainContent } from './home/MainContent';
import { ApiProvider } from './hooks/useApi';
import { MyLocationProvider } from './map/location/context';
import { MainMap } from './map/MainMap';
import { Router } from './router/Router';
import { RouteDetailProvider } from './routes/timetable/context';

export function App() {
  return (
    <Router>
      <ApiProvider>
        <MapProvider>
          <MyLocationProvider>
            <RouteDetailProvider>
              <main class="main">
                <MainMap />
                <MainContent />
              </main>
            </RouteDetailProvider>
          </MyLocationProvider>
        </MapProvider>
      </ApiProvider>
    </Router>
  );
}
