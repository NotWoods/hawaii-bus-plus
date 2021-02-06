import { MapProvider } from '@hawaii-bus-plus/react-google-maps';
import { h } from 'preact';
import { useState } from 'preact/hooks';
import { ApiProvider } from './hooks/useApi';
import { MainMap } from './map/MainMap';
import { Navbar } from './navbar/Navbar';
import { PageWrapper } from './page-wrapper/PageWrapper';
import { Router } from './router/Router';
import { RouteDetailProvider } from './routes/sheet/context';
import { Sheet } from './routes/Sheet';
import { DirectionsSidebar } from './sidebar/directions/DirectionsSidebar';
import { Sidebar } from './sidebar/Sidebar';
import { PointCard } from './stop/PointCard';

export function App() {
  const [directionsOpen, setDirectionsOpen] = useState(false);

  return (
    <Router>
      <ApiProvider>
        <MapProvider>
          <RouteDetailProvider>
            <PageWrapper
              navbar={(props) => <Navbar {...props} />}
              sidebar={
                directionsOpen ? (
                  <DirectionsSidebar onClose={() => setDirectionsOpen(false)} />
                ) : (
                  <Sidebar onDirectionsClick={() => setDirectionsOpen(true)} />
                )
              }
            >
              {(darkMode) => (
                <div className="content-wrapper">
                  <MainMap darkMode={darkMode} />
                  <PointCard />
                  <Sheet />
                </div>
              )}
            </PageWrapper>
          </RouteDetailProvider>
        </MapProvider>
      </ApiProvider>
    </Router>
  );
}
