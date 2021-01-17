import React, { ReactNode, useState } from 'react';
import { stops, routes } from '../../mock/api';
import { useAccessKey } from '../hooks/useAccessKey';
import { SidebarTitle } from './SidebarTitle';
import './Sidebar.css';
import {
  PlaceSearchItem,
  RouteSearchItem,
  StopSearchItem,
} from './SearchItems';
import { AllRoutes } from './AllRoutes';
import { SidebarSearch } from './SidebarSearch';

export function Sidebar() {
  const inputRef = useAccessKey<HTMLInputElement>('shift+f');
  const [search, setSearch] = useState('');

  let children: ReactNode;
  if (search) {
    children = <SidebarSearch search={search} />;
  } else {
    children = <AllRoutes />;
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
