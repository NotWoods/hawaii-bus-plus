import { MapProvider } from '@hawaii-bus-plus/react-google-maps';
import { h } from 'preact';
import { Sheet } from './directions/JourneySheet';
import { Overlay } from './home/Overlay';
import { ApiProvider } from './hooks/useApi';
import { Router } from './router/Router';
import { RouteDetailProvider } from './routes/timetable/context';

export function App() {
  return (
    <Router>
      <ApiProvider>
        <MapProvider>
          <RouteDetailProvider>
            <main>
              <Overlay />
              <Sheet />
            </main>
          </RouteDetailProvider>
        </MapProvider>
      </ApiProvider>
    </Router>
  );
}
