import { MapProvider } from '@hawaii-bus-plus/react-google-maps';
import { h } from 'preact';
import { Main } from './home/Main';
import { ApiProvider } from './hooks/useApi';
import { Router } from './router/Router';
import { RouteDetailProvider } from './routes/timetable/context';

export function App() {
  return (
    <Router>
      <ApiProvider>
        <MapProvider>
          <RouteDetailProvider>
            <Main />
          </RouteDetailProvider>
        </MapProvider>
      </ApiProvider>
    </Router>
  );
}
