import React from 'react';
import { useAccessKey } from '../hooks/useAccessKey';
import { SidebarItem } from './SidebarItem';
import { SidebarTitle } from './SidebarTitle';
import './Sidebar.css';
import { Route, Stop } from '../../shared/gtfs-types';
import {
  PlaceSearchItem,
  RouteSearchItem,
  StopSearchItem,
} from './SearchItems';

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
      <RouteSearchItem
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

      <SidebarTitle>Stops</SidebarTitle>
      <StopSearchItem
        stop={TEST_STOP}
        onClick={() => props.onOpenStop(TEST_STOP)}
      />

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
