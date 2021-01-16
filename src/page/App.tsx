import { GoogleMap, LoadScript } from '@react-google-maps/api';
import React, { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Stop } from '../shared/gtfs-types';
import { StickyAlertsList, StickyAlertsProvider } from './alert/StickyAlerts';
import { Navbar } from './Navbar';
import { Sidebar } from './sidebar/Sidebar';
import { StopCard } from './stop/Stop';

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
    <StickyAlertsProvider>
      <div
        className={`page-wrapper with-transitions with-navbar with-sidebar ${
          darkMode ? 'dark-mode' : ''
        }`}
        data-sidebar-type="overlayed-sm-and-down"
        data-sidebar-hidden={showSidebar ? undefined : 'hidden'}
      >
        <StickyAlertsList />
        <Navbar toggleSidebar={toggleSidebar} toggleDarkMode={toggleDarkMode} />
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
        <Sidebar />
        <div className="content-wrapper">
          <LoadScript googleMapsApiKey="AIzaSyAmRiFwEOokwUHYXK1MqYl5k2ngHoWGJBw">
            <GoogleMap
              center={{ lat: 19.6, lng: -155.56 }}
              zoom={10}
              options={{ streetViewControl: false }}
            >
              <StopCard
                stop={
                  {
                    stop_id: 'll',
                    stop_name: 'Lakeland',
                    stop_desc: '(Mud Lane, bus shelter)',
                    position: {
                      lat: 20.042747082274264,
                      lng: -155.5970094640878,
                    },
                    routes: ['waimea'],
                  } as Stop
                }
                onClose={() => {}}
              />
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </StickyAlertsProvider>
  );
}
