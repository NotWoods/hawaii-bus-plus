import React from 'react';
import menuIcon from './icons/menu.svg';
import searchIcon from './icons/search.svg';
import darkModeIcon from './icons/dark_mode.svg';

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
          <img className="icon" src={menuIcon} alt="Toggle sidebar" />
        </button>
      </div>

      <a href="/" className="navbar-brand">
        <img src="/icon/transparent.png" alt="" />
        Hawaii Bus Plus
      </a>

      <form className="form-inline ml-auto" action="..." method="...">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search route or location"
            required
          />
          <div className="input-group-append">
            <button
              className="btn"
              type="submit"
              title="Search route or location"
            >
              <img
                className="icon"
                src={searchIcon}
                alt="Search route or location"
              />
            </button>
          </div>
        </div>
      </form>

      <div className="navbar-content ml-auto">
        <button
          className="btn btn-action mr-5"
          type="button"
          onClick={props.toggleDarkMode}
        >
          <img className="icon" src={darkModeIcon} alt="Toggle dark mode" />
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
