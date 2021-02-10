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
        'flex flex-col snap-start w-32 shadow hover:shadow-lg p-2 h-full transition bg-blue-100 hover:bg-blue-200 dark:bg-blue-700 dark:hover:bg-blue-600 text-black dark:text-white',
        props.className
      )}
      onClick={props.onClick}
    >
      <RouteIcon style={colorVariables(route)}>
        {route.route_short_name}
      </RouteIcon>
      <p className="mt-2 text-sm">{route.route_long_name}</p>
      <p className="mt-auto text-xs text-right">{agency.agency_name}</p>
    </Link>
  );
}
