import React from 'react';
import { stops, routes } from '../../mock/api';
import { useAccessKey } from '../hooks/useAccessKey';
import { SidebarTitle } from './SidebarTitle';
import './Sidebar.css';
import { Route } from '../../shared/gtfs-types';
import {
  PlaceSearchItem,
  RouteSearchItem,
  StopSearchItem,
} from './SearchItems';

export function Sidebar() {
  const inputRef = useAccessKey<HTMLInputElement>('shift+f');

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <input
          type="search"
          className="form-control"
          placeholder="Route or location"
          aria-label="Route or location"
          accessKey="f"
          ref={inputRef}
        />
      </div>

      <SidebarTitle>Routes</SidebarTitle>
      <RouteSearchItem route={routes.kona} />

      <SidebarTitle>Stops</SidebarTitle>
      <StopSearchItem stop={stops.ll} />

      <SidebarTitle>Other places</SidebarTitle>
      <PlaceSearchItem
        placeId=""
        text={{
          main_text: 'Hilo Cafe',
          secondary_text: '123 Hwy 250',
          main_text_matched_substrings: [],
          secondary_text_matched_substrings: [],
        }}
      />
    </aside>
  );
}
