import React from 'react';
import busIcon from '../icons/directions_bus.svg';
import { SidebarItem } from '../sidebar/SidebarItem';
import { Stop } from '../../shared/gtfs-types';
import './Stop.css';
import { StreetViewPano } from './StreetViewPano';

interface Props {
  stop: Stop;
  onClose(): void;
}

export function StopCard({ stop, onClose }: Props) {
  return (
    <div className="w-400">
      <aside className="stop card p-0">
        <div className="aspect-ratio-container">
          <StreetViewPano
            className="bg-very-dark aspect-ratio rounded-top"
            position={stop.position}
            onClose={onClose}
          >
            <img className="rounded-top" alt="Street view" />
          </StreetViewPano>
        </div>
        <div className="content">
          <h2 className="card-title">{stop.stop_name}</h2>
          <p className="text-muted">{stop.stop_desc}</p>
        </div>
        <div className="content">
          <h3 className="content-title">Nearby routes</h3>
          <SidebarItem
            icon={busIcon}
            iconAlt="Bus route"
            title="20 &middot; Intra Kona"
            subtitle="Hele-On"
            iconBackgroundType="bg-primary"
          />
        </div>
      </aside>
    </div>
  );
}
