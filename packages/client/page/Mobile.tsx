import { MapProvider } from '@hawaii-bus-plus/react-google-maps';
import { h } from 'preact';
import { ApiProvider } from './hooks/useApi';
import { Router } from './router/Router';
import { RouteDetailProvider } from './routes/sheet/context';
import { SimpleSearch } from './search/simple/SimpleSearch';

export function App() {
  return (
    <Router>
      <ApiProvider>
        <MapProvider>
          <RouteDetailProvider>
            <SimpleSearch />
          </RouteDetailProvider>
        </MapProvider>
      </ApiProvider>
    </Router>
  );
}
