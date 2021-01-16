import React from 'react';

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <button className="btn btn-action" type="button">
          <i className="fa fa-bars" aria-hidden="true"></i>
          <span className="sr-only">Toggle sidebar</span>
        </button>
      </div>

      <a href="/" className="navbar-brand">
        <img src="/icon/transparent.png" alt="" />
        Hawaii Bus Plus
      </a>
      <div className="navbar-content ml-auto">
        <button className="btn btn-primary" type="button">
          Sign up
        </button>
      </div>
    </nav>
  );
}
