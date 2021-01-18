import React, { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import {
  center,
  darkStyles,
  GoogleMapPortal,
  MapProvider,
  mapTypeControlOptions,
} from '../react-google-maps';
import { StickyAlertsList, StickyAlertsProvider } from './alert/StickyAlerts';
import { ApiProvider } from './data/Api';
import { classNames } from './hooks/classnames';
import { StopMarkers } from './map/StopMarkers';
import { Navbar } from './Navbar';
import { Router } from './router/Router';
import { RouteSheet } from './routes/RouteSheet';
import { Sidebar } from './sidebar/Sidebar';
import { StopCard } from './stop/StopCard';

export function App() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [darkMode, setDarkMode] = useState(
    matchMedia('(prefers-color-scheme: dark)').matches
  );

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
              <Sidebar />
              <div className="content-wrapper">
                <GoogleMapPortal
                  mapContainerClassName="map w-full h-full"
                  center={center}
                  zoom={9}
                  options={{
                    streetViewControl: false,
                    mapTypeControlOptions,
                    controlSize: 32,
                    styles: darkMode
                      ? (darkStyles as google.maps.MapTypeStyle[])
                      : undefined,
                  }}
                >
                  <StopMarkers />
                </GoogleMapPortal>
                <StopCard />
              </div>
              <RouteSheet />
            </div>
          </StickyAlertsProvider>
        </MapProvider>
      </ApiProvider>
    </Router>
  );
}
