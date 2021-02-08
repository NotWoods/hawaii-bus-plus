import { ComponentChildren, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { useHotkeys } from 'react-hotkeys-hook';
import { classNames } from '../hooks/classnames';
import { StickyAlertsList, StickyAlertsProvider } from './alert/StickyAlerts';

interface Props {
  navbar(props: {
    toggleSidebar(): void;
    toggleDarkMode(): void;
  }): ComponentChildren;
  sidebar: ComponentChildren;
  children(darkMode: boolean): ComponentChildren;
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

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

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
        <div className="sidebar-overlay" onClick={toggleSidebar} />
        {props.sidebar}
        {props.children(darkMode)}
      </div>
    </StickyAlertsProvider>
  );
}
