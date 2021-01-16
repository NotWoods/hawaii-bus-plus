import React from 'react';
import { useAccessKey } from '../hooks/useAccessKey';
import { SidebarItem } from './SidebarItem';
import { SidebarTitle } from './SidebarTitle';
import busIcon from '../icons/directions_bus.svg';
import busStopIcon from '../icons/bus_stop.svg';
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
      </div>

      <SidebarTitle>Routes</SidebarTitle>
      <SidebarItem
        icon={busIcon}
        iconAlt="Bus route"
        title="20 &middot; Intra Kona"
        subtitle="Hele-On"
        iconBackgroundType="bg-primary"
      />

      <SidebarTitle>Stops</SidebarTitle>
      <SidebarItem
        icon={busStopIcon}
        iconAlt="Bus stop"
        title="Lakeland"
        href="?stop=ll"
        subtitle={
          <>
            <span className="border rounded px-5" title="Intra Kona">
              20
            </span>{' '}
            <span className="border rounded px-5" title="Intra Hilo">
              150
            </span>
          </>
        }
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
