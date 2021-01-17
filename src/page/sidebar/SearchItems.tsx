import React, { ReactNode } from 'react';
import { Route, Stop } from '../../shared/gtfs-types';
import busIcon from '../icons/directions_bus.svg';
import busStopIcon from '../icons/bus_stop.svg';
import placeIcon from '../icons/place.svg';
import { SidebarItem, SidebarItemProps } from './SidebarItem';
import { setRouteAction, setStopAction } from '../router/action';
import { RouteBadge } from './RouteBadge';

type SearchItemProps = Pick<SidebarItemProps, 'className' | 'onClick'>;

interface RouteSearchItemProps extends SearchItemProps {
  route: Route;
}

export function RouteSearchItem({ route, ...props }: RouteSearchItemProps) {
  const action = setRouteAction(route);
  return (
    <SidebarItem
      {...props}
      href={action.href}
      action={action}
      icon={busIcon}
      iconAlt="Bus route"
      iconColor={`#${route.route_color}`}
      iconDark={route.route_text_color === '000000'}
      title={`${route.route_short_name} · ${route.route_long_name}`}
      subtitle="Hele-On Bus"
    />
  );
}

interface StopSearchItemProps extends SearchItemProps {
  stop: Stop;
}

export function StopSearchItem({ stop, ...props }: StopSearchItemProps) {
  const badges: ReactNode[] = [];
  for (const route of stop.routes) {
    badges.push(<RouteBadge route_short_name="20" key={route} />);
    badges.push(' ');
  }

  const action = setStopAction(stop);
  return (
    <SidebarItem
      {...props}
      href={action.href}
      action={action}
      icon={busStopIcon}
      iconAlt="Bus stop"
      title={stop.stop_name}
      subtitle={badges.slice(0, -1)}
    />
  );
}

interface PlaceSearchItemProps extends SearchItemProps {
  placeId: string;
  text: google.maps.places.AutocompleteStructuredFormatting;
}

export function PlaceSearchItem({
  placeId,
  text,
  ...props
}: PlaceSearchItemProps) {
  return (
    <SidebarItem
      {...props}
      href={`?place=${placeId}`}
      icon={placeIcon}
      iconAlt="Place"
      title={text.main_text}
      subtitle={text.secondary_text}
    />
  );
}
