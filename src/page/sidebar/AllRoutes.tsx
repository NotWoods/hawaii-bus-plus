import React from 'react';
import { useApi } from '../data/Api';
import { RouteSearchItem } from './SearchItems';
import { SidebarTitle } from './SidebarTitle';

export function AllRoutes() {
  const api = useApi();
  const routes = api ? Object.values(api.routes) : [];

  return (
    <>
      <SidebarTitle>Routes</SidebarTitle>
      {routes.map((route) => (
        <RouteSearchItem key={route.route_id} route={route} />
      ))}
    </>
  );
}
