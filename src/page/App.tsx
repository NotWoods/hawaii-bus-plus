import React, { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

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
    <div
      className={`page-wrapper with-transitions with-navbar with-sidebar ${
        darkMode ? 'dark-mode' : ''
      }`}
      data-sidebar-type="overlayed-sm-and-down"
      data-sidebar-hidden={showSidebar ? undefined : 'hidden'}
    >
      <div className="sticky-alerts"></div>
      <Navbar toggleSidebar={toggleSidebar} toggleDarkMode={toggleDarkMode} />
      <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      <Sidebar />
      <div className="content-wrapper"></div>
    </div>
  );
}
