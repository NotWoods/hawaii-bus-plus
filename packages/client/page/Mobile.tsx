import { MapProvider } from '@hawaii-bus-plus/react-google-maps';
import { h } from 'preact';
import { HomeOverlay } from './home/HomeOverlay';
import { ApiProvider } from './hooks/useApi';
import { Router } from './router/Router';
import { RouteDetailProvider } from './routes/sheet/context';

export function App() {
  return (
    <Router>
      <ApiProvider>
        <MapProvider>
          <RouteDetailProvider>
            <HomeOverlay />
          </RouteDetailProvider>
        </MapProvider>
      </ApiProvider>
    </Router>
  );
}
