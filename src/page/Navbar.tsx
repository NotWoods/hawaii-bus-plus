import React from 'react';
import menuIcon from './icons/menu.svg';
import darkModeIcon from './icons/dark_mode.svg';
import './Navbar.css';
import { Icon } from './icons/Icon';

interface Props {
  toggleSidebar(): void;
  toggleDarkMode(): void;
}

export function Navbar(props: Props) {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <button
          className="btn btn-action"
          type="button"
          title="Toggle sidebar"
          onClick={props.toggleSidebar}
          accessKey="s"
        >
          <Icon src={menuIcon} alt="Toggle sidebar" />
        </button>
      </div>

      <a href="/" className="navbar-brand">
        <img src="/icon/transparent.png" alt="" />
        Hawaii Bus Plus
      </a>

      <div className="navbar-content ml-auto">
        <button
          className="btn btn-action mr-5"
          type="button"
          title="Toggle dark mode"
          onClick={props.toggleDarkMode}
        >
          <Icon src={darkModeIcon} alt="Toggle dark mode" />
        </button>
        <div
          className="btn-group"
          role="group"
          aria-label="Another button group"
        >
          <a href="/login" className="btn">
            Log in
          </a>
          <a href="/signup" className="btn btn-primary">
            Sign up
          </a>
        </div>
      </div>
    </nav>
  );
}
