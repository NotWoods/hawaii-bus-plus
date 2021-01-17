import React from 'react';
import busIcon from '../icons/directions_bus.svg';
import { SidebarItem } from '../sidebar/SidebarItem';
import { Route, Stop } from '../../shared/gtfs-types';
import './Stop.css';
import { StreetViewPano } from './StreetViewPano';
import { RouteSearchItem } from '../sidebar/SearchItems';

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
          <h2 className="card-title mb-0">{stop.stop_name}</h2>
          <p className="text-muted mt-0">{stop.stop_desc}</p>
        </div>
        <div className="content">
          <h3 className="content-title">Nearby routes</h3>
          <RouteSearchItem
            className="p-0"
            route={
              {
                route_id: 'kona',
                route_short_name: '',
                route_long_name: 'Intra-Kona Combined Schedule',
                route_desc:
                  "This route operates between Captain Cook and North Kona via Routes 11 19 and 190 traveling through Ali'i Drive.",
                route_type: 3,
                route_url:
                  'http://www.heleonbus.org/schedules-and-maps/intra-kona-7-1-2014',
                route_color: '8400a8',
                route_text_color: 'ffffff',
              } as Route
            }
          />
        </div>
      </aside>
    </div>
  );
}
