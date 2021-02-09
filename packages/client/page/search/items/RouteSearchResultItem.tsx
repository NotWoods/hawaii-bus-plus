import { Agency, Route } from '@hawaii-bus-plus/types';
import { h } from 'preact';
import { classNames } from '../../hooks/classnames';
import { Link } from '../../router/Router';
import { RouteIcon } from '../../routes/badge/RouteIcon';
import { colorVariables } from '../../routes/props';

interface Props {
  route: Route;
  agency: Pick<Agency, 'agency_name' | 'primary'>;
  className?: string;
  onClick?(evt: MouseEvent): void;
}

export function RouteSearchResultItem(props: Props) {
  const { route, agency } = props;
  return (
    <Link
      href={`/routes/${route.route_id}/`}
      class={classNames('block p-2 text-white', props.className)}
      onClick={props.onClick}
    >
      <RouteIcon style={colorVariables(route)}>
        {route.route_short_name}
      </RouteIcon>
      <p className="mt-2 text-sm">{route.route_long_name}</p>
      {agency.primary ? undefined : (
        <p className="text-xs">{agency.agency_name}</p>
      )}
    </Link>
  );
}
