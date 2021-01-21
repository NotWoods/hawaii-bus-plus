import React from 'react';
import { useApi } from '../data/Api';
import { RouteSearchItem } from './SearchItems';
import { SidebarTitle } from './SidebarTitle';
import locationIcon from '../icons/gps_fixed.svg';
import directionsIcon from '../icons/directions.svg';
import { Icon } from '../icons/Icon';

interface Props {
  onDirectionsClick?(): void;
}

export function DefaultRoutes(props: Props) {
  const api = useApi();
  const routes = api ? Object.values(api.routes) : [];

  return (
    <>
      <div className="sidebar-content">
        <button className="btn btn-sm" type="button">
          <Icon src={locationIcon} alt="" /> My location
        </button>

        <button
          className="btn btn-sm"
          type="button"
          onClick={props.onDirectionsClick}
        >
          <Icon src={directionsIcon} alt="" /> Directions
        </button>
      </div>

      <SidebarTitle>Routes</SidebarTitle>
      {routes.map((route) => (
        <RouteSearchItem key={route.route_id} route={route} />
      ))}
    </>
  );
}
