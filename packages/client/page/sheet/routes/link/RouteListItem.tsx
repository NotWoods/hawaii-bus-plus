import { Agency, Route } from '@hawaii-bus-plus/types';

import { RouteIcon } from '../../../../components/RouteIcon/RouteIcon';
import { colorVariables } from '../../../../components/route-colors';
import { setRouteAction } from '../../../router/action/main';
import { Link } from '../../../router/Router';

interface Props {
  route: Route;
  agency: Pick<Agency, 'agency_short_name' | 'primary'>;
  current: boolean;
  onClick?(evt: MouseEvent): void;
}

/**
 * Displays a card representing a route.
 * Shows a icon with route number, followed by route name and agency name.
 */
export function RouteLinkVertical({ route, agency, current, onClick }: Props) {
  return (
    <Link
      href={`/routes/${route.route_id}/`}
      class="flex flex-col snap-start w-32 shadow hover:shadow-lg p-2 h-full motion-safe:transition bg-primary-50 hover:bg-primary-100 dark:bg-primary-600 dark:hover:bg-primary-500 text-gray-800 dark:text-white"
      aria-current={current ? 'page' : undefined}
      onClick={onClick}
      action={setRouteAction(route.route_id)}
    >
      <RouteIcon style={colorVariables(route)}>
        {route.route_short_name}
      </RouteIcon>
      <p className="mt-2 text-sm">{route.route_long_name}</p>
      <p className="mt-auto text-xs text-right">{agency.agency_short_name}</p>
    </Link>
  );
}
