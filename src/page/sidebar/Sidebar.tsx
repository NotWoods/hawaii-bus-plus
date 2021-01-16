import React from 'react';
import { useAccessKey } from '../hooks/useAccessKey';
import { SidebarItem } from './SidebarItem';
import { SidebarTitle } from './SidebarTitle';
import busIcon from '../icons/directions_bus.svg';
import busStopIcon from '../icons/bus_stop.svg';
import placeIcon from '../icons/place.svg';
import './Sidebar.css';
import { Stop } from '../../shared/gtfs-types';

const TEST_STOP = {
  stop_id: 'll',
  stop_name: 'Lakeland',
  stop_desc: '(Mud Lane, bus shelter)',
  position: {
    lat: 20.042747082274264,
    lng: -155.5970094640878,
  },
  routes: ['waimea'],
} as Stop;

interface Props {
  onOpenStop(stop: Stop): void;
}

export function Sidebar(props: Props) {
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
        onClick={() => props.onOpenStop(TEST_STOP)}
        subtitle={
          <>
            <span className="badge" title="Intra Kona">
              20
            </span>{' '}
            <span className="badge" title="Intra Hilo">
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
