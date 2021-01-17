import { GoogleMap, LoadScript } from '@react-google-maps/api';
import React, { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { StickyAlertsList, StickyAlertsProvider } from './alert/StickyAlerts';
import { classNames } from './hooks/classnames';
import { Navbar } from './Navbar';
import { Router } from './router/Router';
import { Sidebar } from './sidebar/Sidebar';
import { StopMarkers } from './map/StopMarkers';
import { StopCard } from './stop/Stop';
import darkStyles from './map/dark-style.json';
import { center, mapTypeControlOptions } from './map/options';

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
            <LoadScript googleMapsApiKey="AIzaSyAmRiFwEOokwUHYXK1MqYl5k2ngHoWGJBw">
              <GoogleMap
                mapContainerClassName="map w-full h-full"
                center={center}
                zoom={9}
                options={{
                  streetViewControl: false,
                  mapTypeControlOptions,
                  styles: darkMode
                    ? (darkStyles as google.maps.MapTypeStyle[])
                    : undefined,
                }}
              >
                <StopMarkers />
                <StopCard />
              </GoogleMap>
            </LoadScript>
          </div>
        </div>
      </StickyAlertsProvider>
    </Router>
  );
}
