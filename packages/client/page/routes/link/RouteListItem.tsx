import { Agency, Route } from '@hawaii-bus-plus/types';
import { h } from 'preact';
import { classNames } from '../../hooks/classnames';
import { colorVariables } from '../props';
import { RouteIcon } from '../badge/RouteIcon';
import { Link } from '../../router/Router';
import './RouteListItem.css';

interface Props {
  route: Route;
  agency: Pick<Agency, 'agency_name' | 'primary'>;
  className?: string;
  onClick?(evt: MouseEvent): void;
}

export function RouteLinkVertical(props: Props) {
  const { route, agency } = props;
  return (
    <Link
      href={`/routes/${route.route_id}/`}
      class={classNames(
        'flex flex-col w-32 shadow-xl p-2 h-full bg-gray-50 dark:bg-gray-700 dark:text-white',
        props.className
      )}
      onClick={props.onClick}
      style="scroll-snap-align: start"
    >
      <RouteIcon style={colorVariables(route)}>
        {route.route_short_name}
      </RouteIcon>
      <p className="mt-2 text-sm">{route.route_long_name}</p>
      <p className="mt-auto text-xs text-right">{agency.agency_name}</p>
    </Link>
  );
}
