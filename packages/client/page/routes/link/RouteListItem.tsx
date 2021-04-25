import { Agency, Route } from '@hawaii-bus-plus/types';
import { h } from 'preact';
import { RouteIcon } from '../../../all-pages/components/RouteIcon';
import { setRouteAction } from '../../router/action/main';
import { Link } from '../../router/Router';
import { colorVariables } from '../props';

interface Props {
  route: Route;
  agency: Pick<Agency, 'agency_name' | 'primary'>;
  onClick?(evt: MouseEvent): void;
}

export function RouteLinkVertical(props: Props) {
  const { route, agency } = props;
  return (
    <Link
      href={`/routes/${route.route_id}/`}
      class="flex flex-col snap-start w-32 shadow hover:shadow-lg p-2 h-full transition bg-blue-50 hover:bg-blue-100 dark:bg-blue-600 dark:hover:bg-blue-500 text-gray-800 dark:text-white"
      onClick={props.onClick}
      action={setRouteAction(route.route_id)}
    >
      <RouteIcon style={colorVariables(route)}>
        {route.route_short_name}
      </RouteIcon>
      <p className="mt-2 text-sm">{route.route_long_name}</p>
      <p className="mt-auto text-xs text-right">{agency.agency_name}</p>
    </Link>
  );
}
