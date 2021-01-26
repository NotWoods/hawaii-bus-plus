import { Route, Stop } from '@hawaii-bus-plus/types';
import React from 'react';
import { RequireAtLeastOne } from 'type-fest';
import { useApi } from '../data/Api';
import busStopIcon from '../icons/bus_stop.svg';
import { Icon } from '../icons/Icon';
import placeIcon from '../icons/place.svg';
import { setRouteAction, setStopAction } from '../router/action';
import { colorProps } from '../routes/props';
import { RouteName } from '../routes/RouteName';
import { BLANK, RouteBadges } from '../stop/RouteBadge';
import { SidebarItem, SidebarItemProps } from './SidebarItem';

type SearchItemProps = Pick<SidebarItemProps, 'className' | 'onClick'>;

type RouteSearchItemProps = SearchItemProps &
  RequireAtLeastOne<{
    routeId: Route['route_id'];
    route: Route;
  }>;

export function RouteSearchItem({
  routeId,
  route,
  ...props
}: RouteSearchItemProps) {
  let routeProps: SidebarItemProps;
  if (route) {
    const { backgroundColor, dark } = colorProps(route);
    routeProps = {
      action: setRouteAction(route),
      iconColor: backgroundColor,
      iconDark: dark,
      title: route.route_long_name,
      subtitle: 'Hele-On Bus',
      icon: route.route_short_name,
    };
  } else {
    routeProps = {
      title: BLANK,
      subtitle: BLANK,
      icon: '',
    };
  }

  return (
    <SidebarItem
      {...props}
      {...routeProps}
      href={`/routes/${routeId || route!.route_id}/`}
      iconClasses="font-size-14"
    />
  );
}

type StopSearchItemProps = SearchItemProps &
  RequireAtLeastOne<{
    stopId: Stop['stop_id'];
    stop: Stop;
  }>;

export function StopSearchItem({
  stopId,
  stop: stopData,
  ...props
}: StopSearchItemProps) {
  const api = useApi();
  const stop = stopData || api?.stops?.[stopId!];

  return (
    <SidebarItem
      {...props}
      href={`?stop=${stopId || stop!.stop_id}`}
      action={stop ? setStopAction(stop) : undefined}
      icon={<Icon src={busStopIcon} alt="Bus stop" />}
      title={stop?.stop_name || BLANK}
      subtitle={<RouteBadges routeIds={stop?.routes || []} />}
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
      action={undefined}
      icon={<Icon src={placeIcon} alt="Place" />}
      title={text.main_text}
      subtitle={text.secondary_text}
    />
  );
}
