import { GoogleMap, LoadScript } from '@react-google-maps/api';
import React, { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { StickyAlertsList, StickyAlertsProvider } from './alert/StickyAlerts';
import { classNames } from './hooks/classnames';
import { Navbar } from './Navbar';
import { Router } from './router/Router';
import { Sidebar } from './sidebar/Sidebar';
import { StopCard } from './stop/Stop';

const center = { lat: 19.6, lng: -155.56 };

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
                zoom={10}
                options={{ streetViewControl: false }}
              >
                <div></div>
                <StopCard />
              </GoogleMap>
            </LoadScript>
          </div>
        </div>
      </StickyAlertsProvider>
    </Router>
  );
}
