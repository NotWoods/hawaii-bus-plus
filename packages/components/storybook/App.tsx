import React, { ReactNode, useState } from 'react';
import { Icon } from '../src/icon/Icon';
import darkModeIcon from './icons/dark_mode.svg';
import menuIcon from './icons/menu.svg';

interface Props {
  [name: string]: ReactNode;
}

export function App(props: Props) {
  const [showSidebar, setShowSidebar] = useState(true);
  const [darkMode, setDarkMode] = useState(
    matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [openStory, setOpenStory] = useState('');

  function toggleSidebar() {
    setShowSidebar(!showSidebar);
  }
  function toggleDarkMode() {
    setDarkMode(!darkMode);
  }

  function handleItemClick(evt: React.MouseEvent<HTMLAnchorElement>) {
    evt.preventDefault();
    console.log(evt.currentTarget.href.slice(1));
    setOpenStory(evt.currentTarget.href.slice(1));
  }

  return (
    <div
      className={`page-wrapper with-transitions with-navbar with-sidebar ${
        darkMode && 'dark-mode'
      }`}
      data-sidebar-type="overlayed-sm-and-down"
      data-sidebar-hidden={showSidebar ? undefined : 'hidden'}
    >
      <nav className="navbar">
        <div className="navbar-content">
          <button
            className="btn btn-action"
            type="button"
            title="Toggle sidebar"
            onClick={toggleSidebar}
          >
            <Icon src={menuIcon} alt="Toggle sidebar" />
          </button>
        </div>

        <a href="/" className="navbar-brand">
          Storybook
        </a>

        <div className="navbar-content ml-auto">
          <button
            className="btn btn-action mr-5"
            type="button"
            title="Toggle dark mode"
            onClick={toggleDarkMode}
          >
            <Icon src={darkModeIcon} alt="Toggle dark mode" />
          </button>
        </div>
      </nav>
      <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      <aside className="sidebar">
        {Object.keys(props).map((storyName) => (
          <a
            href={`#${storyName}`}
            className={`sidebar-link ${storyName === openStory && 'active'}`}
            onClick={handleItemClick}
          >
            {storyName}
          </a>
        ))}
      </aside>
      <div className="content-wrapper">{props[openStory]}</div>
    </div>
  );
}
