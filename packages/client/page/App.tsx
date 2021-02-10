import { MapProvider } from '@hawaii-bus-plus/react-google-maps';
import { h } from 'preact';
import { MainContent } from './home/MainContent';
import { ApiProvider } from './hooks/useApi';
import { MainMap } from './map/MainMap';
import { Router } from './router/Router';
import { RouteDetailProvider } from './routes/timetable/context';

export function App() {
  return (
    <Router>
      <ApiProvider>
        <MapProvider>
          <RouteDetailProvider>
            <main class="main">
              <MainMap />
              <MainContent />
            </main>
          </RouteDetailProvider>
        </MapProvider>
      </ApiProvider>
    </Router>
  );
}
