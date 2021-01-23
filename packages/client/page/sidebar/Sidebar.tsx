import React, { ReactNode, useState } from 'react';
import { useAccessKey } from '../hooks/useAccessKey';
import { DefaultRoutes } from './DefaultRoutes';
import './Sidebar.css';
import { SidebarSearch } from './SidebarSearch';

interface Props {
  onDirectionsClick?(): void;
}

export function Sidebar(props: Props) {
  const inputRef = useAccessKey<HTMLInputElement>('shift+f');
  const [search, setSearch] = useState('');

  let children: ReactNode;
  if (search) {
    children = <SidebarSearch search={search} />;
  } else {
    children = <DefaultRoutes onDirectionsClick={props.onDirectionsClick} />;
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <input
          type="search"
          className="form-control"
          placeholder="Route or location"
          aria-label="Route or location"
          accessKey="f"
          value={search}
          ref={inputRef}
          onChange={(evt) => setSearch(evt.currentTarget.value)}
        />
      </div>

      {children}
    </aside>
  );
}