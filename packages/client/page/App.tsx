import { MapProvider } from '@hawaii-bus-plus/react-google-maps';
import React, { useState } from 'react';
import { DirectionsSheet } from './directions/DirectionsSheet';
import { ApiProvider } from './hooks/useApi';
import { MainMap } from './map/MainMap';
import { Navbar } from './Navbar';
import { PageWrapper } from './page-wrapper/PageWrapper';
import { Router } from './router/Router';
import { RouteDetailProvider } from './routes/context';
import { RouteSheet } from './routes/RouteSheet';
import { DirectionsSidebar } from './sidebar/directions/DirectionsSidebar';
import { Sidebar } from './sidebar/Sidebar';
import { PointCard } from './stop/PointCard';

export function App() {
  const [directionsOpen, setDirectionsOpen] = useState(false);
  const [position, setPosition] = useState<GeolocationPosition | undefined>();

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
                  <Sidebar
                    setPosition={setPosition}
                    onDirectionsClick={() => setDirectionsOpen(true)}
                  />
                )
              }
            >
              {(darkMode) => (
                <div className="content-wrapper">
                  <MainMap darkMode={darkMode} position={position} />
                  <PointCard />
                  {directionsOpen ? <DirectionsSheet /> : <RouteSheet />}
                </div>
              )}
            </PageWrapper>
          </RouteDetailProvider>
        </MapProvider>
      </ApiProvider>
    </Router>
  );
}
