import React, { ReactNode } from 'react';
import { Route, Stop } from '../../shared/gtfs-types';
import busIcon from '../icons/directions_bus.svg';
import busStopIcon from '../icons/bus_stop.svg';
import placeIcon from '../icons/place.svg';
import { SidebarItem, SidebarItemProps } from './SidebarItem';
import { setRouteAction, setStopAction } from '../router/action';
import { RouteBadge } from './RouteBadge';
import { colorProps } from '../routes/props';
import { routes } from '../../mock/api';
import { useApi } from '../data/Api';

const BLANK = ' ';

type SearchItemProps = Pick<SidebarItemProps, 'className' | 'onClick'>;

interface RouteSearchItemProps extends SearchItemProps {
  routeId?: string;
  route?: Route;
}

export function RouteSearchItem({
  routeId,
  route: routeData,
  ...props
}: RouteSearchItemProps) {
  const api = useApi();
  const route = routeData || api?.routes?.[routeId!];

  let routeProps: Omit<SidebarItemProps, 'icon' | 'iconAlt'>;
  if (route) {
    const { backgroundColor, dark } = colorProps(route);
    routeProps = {
      action: setRouteAction(route),
      iconColor: backgroundColor,
      iconDark: dark,
      title: `${route.route_short_name} · ${route.route_long_name}`,
      subtitle: 'Hele-On Bus',
    };
  } else {
    routeProps = {
      title: BLANK,
      subtitle: BLANK,
    };
  }
  return (
    <SidebarItem
      {...props}
      {...routeProps}
      href={`/routes/${routeId || route!.route_id}/`}
      icon={busIcon}
      iconAlt="Bus route"
    />
  );
}

interface StopSearchItemProps extends SearchItemProps {
  stopId?: string;
  stop?: Stop;
}

export function StopSearchItem({
  stopId,
  stop: stopData,
  ...props
}: StopSearchItemProps) {
  const api = useApi();
  const stop = stopData || api?.stops?.[stopId!];

  const badges: ReactNode[] = [];
  if (stop) {
    for (const route of stop.routes) {
      badges.push(
        <RouteBadge route={routes[route as keyof typeof routes]} key={route} />
      );
      badges.push(' ');
    }
    badges.pop();
  }

  return (
    <SidebarItem
      {...props}
      href={`?stop=${stopId || stop!.stop_id}`}
      action={stop ? setStopAction(stop) : undefined}
      icon={busStopIcon}
      iconAlt="Bus stop"
      title={stop?.stop_name || BLANK}
      subtitle={badges.length > 0 ? badges : BLANK}
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
