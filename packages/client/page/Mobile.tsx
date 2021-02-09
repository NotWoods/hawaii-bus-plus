import { MapProvider } from '@hawaii-bus-plus/react-google-maps';
import { h } from 'preact';
import { ApiProvider } from './hooks/useApi';
import { Router } from './router/Router';
import { RouteDetailProvider } from './routes/sheet/context';
import { DirectionsSearch } from './search/directions/DirectionsSearch';

export function App() {
  return (
    <Router>
      <ApiProvider>
        <MapProvider>
          <RouteDetailProvider>
            <DirectionsSearch />
          </RouteDetailProvider>
        </MapProvider>
      </ApiProvider>
    </Router>
  );
}
