import { Agency, Route, Stop } from '@hawaii-bus-plus/types';
import { h } from 'preact';
import busStopIcon from '../icons/bus_stop.svg';
import { Icon } from '../icons/Icon';
import placeIcon from '../icons/place.svg';
import { colorProps, colorVariables } from '../routes/props';
import { BLANK, RouteBadgeKeys, RouteBadges } from '../routes/badge/RouteBadge';
import { SidebarItem, SidebarItemProps } from './SidebarItem';

type SearchItemProps = Pick<SidebarItemProps, 'className' | 'onClick'>;

interface RouteSearchItemProps extends SearchItemProps {
  route: Route;
  agency: Pick<Agency, 'agency_name' | 'primary'>;
}

export function RouteSearchItem({
  route,
  agency,
  ...props
}: RouteSearchItemProps) {
  const { dark } = colorProps(route);

  return (
    <SidebarItem
      {...props}
      icon={route.route_short_name}
      iconDark={dark}
      iconClasses="icon--route"
      iconStyle={colorVariables(route)}
      title={route.route_long_name}
      subtitle={agency.primary ? undefined : agency.agency_name}
      href={`/routes/${route.route_id}/`}
    />
  );
}

interface StopSearchItemProps extends SearchItemProps {
  stopId: Stop['stop_id'];
  stopName?: string;
  stopDesc?: string;
  routes?: readonly Pick<Route, RouteBadgeKeys>[];
}

export function StopSearchItem({
  stopId,
  stopName = BLANK,
  stopDesc,
  routes,
  ...props
}: StopSearchItemProps) {
  return (
    <SidebarItem
      {...props}
      href={`?stop=${stopId}`}
      icon={<Icon src={busStopIcon} alt="Bus stop" />}
      title={stopName}
      subtitle={stopDesc ?? <RouteBadges routes={routes} />}
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
