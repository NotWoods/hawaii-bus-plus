import { h } from 'preact';
import darkModeIcon from './icons/dark_mode.svg';
import { Icon } from './icons/Icon';
import menuIcon from './icons/menu.svg';
import './Navbar.css';
import { NavbarContainer } from './page-wrapper/Containers';

interface Props {
  toggleSidebar(): void;
  toggleDarkMode(): void;
}

export function Navbar(props: Props) {
  return (
    <NavbarContainer>
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
        <img src="/icon/logo.svg" alt="" />
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
    </NavbarContainer>
  );
}
