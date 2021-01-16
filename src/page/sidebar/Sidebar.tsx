import React from 'react';
import { useAccessKey } from '../hooks/useAccessKey';
import { SidebarItem } from './SidebarItem';
import { SidebarTitle } from './SidebarTitle';
import busIcon from '../icons/directions_bus.svg';
import placeIcon from '../icons/place.svg';
import './Sidebar.css';

export function Sidebar() {
  const inputRef = useAccessKey<HTMLInputElement>('shift+f');

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <input
          type="search"
          className="form-control"
          placeholder="Search"
          accessKey="f"
          ref={inputRef}
        />
        <div className="mt-10 font-size-12">
          Press <kbd>shift</kbd> + <kbd>F</kbd> to focus
        </div>
      </div>

      <SidebarTitle>Routes</SidebarTitle>
      <SidebarItem
        icon={busIcon}
        iconAlt="Bus route"
        title="Intra Kona"
        subtitle="Hele-On"
        iconBackgroundType="bg-primary"
      />

      <SidebarTitle>Stops</SidebarTitle>
      <SidebarItem
        icon={placeIcon}
        iconAlt="Bus stop"
        title="Lakeland"
        subtitle="..."
      />

      <SidebarTitle>Other places</SidebarTitle>
      <SidebarItem
        icon={placeIcon}
        iconAlt="Place"
        title="Hilo Cafe"
        subtitle="123 Hwy 250"
      />
    </aside>
  );
}
