import React, { ReactNode, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { StickyAlertsList, StickyAlertsProvider } from './alert/StickyAlerts';
import { classNames } from './hooks/classnames';

interface Props {
  navbar(props: { toggleSidebar(): void; toggleDarkMode(): void }): ReactNode;
  sidebar: ReactNode;
  children(darkMode: boolean): ReactNode;
}

export function PageWrapper(props: Props) {
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
        className={classNames(
          `page-wrapper with-transitions with-navbar with-sidebar`,
          darkMode && 'dark-mode'
        )}
        data-sidebar-type="overlayed-sm-and-down"
        data-sidebar-hidden={showSidebar ? undefined : 'hidden'}
      >
        <StickyAlertsList />
        {props.navbar({ toggleSidebar, toggleDarkMode })}
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
        {props.sidebar}
        {props.children(darkMode)}
      </div>
    </StickyAlertsProvider>
  );
}
