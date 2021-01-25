import React, { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { MapProvider } from '@hawaii-bus-plus/react-google-maps';
import { StickyAlertsList, StickyAlertsProvider } from './alert/StickyAlerts';
import { ApiProvider } from './data/Api';
import { classNames } from './hooks/classnames';
import { MainMap } from './map/MainMap';
import { Navbar } from './Navbar';
import { Router } from './router/Router';
import { RouteSheet } from './routes/RouteSheet';
import { DirectionsSidebar } from './sidebar/directions/DirectionsSidebar';
import { Sidebar } from './sidebar/Sidebar';
import { StopOrPlaceCard } from './stop/StopCard';

export function App() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [directionsOpen, setDirectionsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [position, setPosition] = useState<GeolocationPosition | undefined>();

  function toggleSidebar() {
    setShowSidebar(!showSidebar);
  }
  function toggleDarkMode() {
    setDarkMode(!darkMode);
  }

  useHotkeys('shift+s', toggleSidebar, [showSidebar]);
  useHotkeys('shift+d', toggleDarkMode, [darkMode]);

  return (
    <Router>
      <ApiProvider>
        <MapProvider>
          <StickyAlertsProvider>
            <div
              className={classNames(
                `page-wrapper with-transitions with-navbar with-sidebar`,
                darkMode && 'dark-mode'
              )}
              data-sidebar-type="overlayed-sm-and-down"
              data-sidebar-hidden={showSidebar ? undefined : 'hidden'}
            >
              <StickyAlertsList />
              <Navbar
                toggleSidebar={toggleSidebar}
                toggleDarkMode={toggleDarkMode}
              />
              <div className="sidebar-overlay" onClick={toggleSidebar}></div>
              {directionsOpen ? (
                <DirectionsSidebar onClose={() => setDirectionsOpen(false)} />
              ) : (
                <Sidebar
                  setPosition={setPosition}
                  onDirectionsClick={() => setDirectionsOpen(true)}
                />
              )}
              <div className="content-wrapper">
                <MainMap darkMode={darkMode} position={position} />
                <StopOrPlaceCard />
                <RouteSheet />
              </div>
            </div>
          </StickyAlertsProvider>
        </MapProvider>
      </ApiProvider>
    </Router>
  );
}
