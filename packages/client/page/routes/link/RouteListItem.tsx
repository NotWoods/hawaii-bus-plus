import { Agency, Route } from '@hawaii-bus-plus/types';
import { h } from 'preact';
import { classNames } from '../../hooks/classnames';
import { colorVariables } from '../props';
import { RouteIcon } from '../RouteIcon';
import { RouteIcon as RouteIconTw } from '../badge/RouteIcon';
import { Link } from '../../router/Router';
import './RouteListItem.css';

interface Props {
  route: Route;
  agency: Pick<Agency, 'agency_name' | 'primary'>;
  className?: string;
  onClick?(evt: MouseEvent): void;
}

export function RouteListItem(props: Props) {
  const { route, agency } = props;
  return (
    <Link
      href={`/routes/${route.route_id}/`}
      className={classNames(
        'route-link sidebar-link py-2 grid gap-x-4 items-center',
        props.className
      )}
      onClick={props.onClick}
    >
      <RouteIcon style={colorVariables(route)}>
        {route.route_short_name}
      </RouteIcon>
      <p className="sidebar-link-title m-0">{route.route_long_name}</p>
      <p className="sidebar-link-subtitle m-0 font-size-12">
        {agency.primary ? undefined : agency.agency_name}
      </p>
    </Link>
  );
}

export function RouteLinkVertical(props: Props) {
  const { route, agency } = props;
  return (
    <Link
      href={`/routes/${route.route_id}/`}
      className={classNames(
        'flex flex-col w-32 shadow-xl bg-white p-2 h-full',
        props.className
      )}
      onClick={props.onClick}
      style="scroll-snap-align: start"
    >
      <RouteIconTw style={colorVariables(route)}>
        {route.route_short_name}
      </RouteIconTw>
      <p className="mt-2 text-sm">{route.route_long_name}</p>
      <p className="mt-auto text-xs text-right">{agency.agency_name}</p>
    </Link>
  );
}
