import { Agency, Route } from '@hawaii-bus-plus/types';
import { h } from 'preact';
import { classNames } from '../../hooks/classnames';
import { colorVariables } from '../props';
import { RouteIcon } from '../RouteIcon';
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
      className={classNames('route-link sidebar-link', props.className)}
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
