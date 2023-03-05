import { Agency, Route } from '@hawaii-bus-plus/types';
import clsx from 'clsx';

import { colorVariables } from '../../../../components/route-colors';
import { RouteIcon } from '../../../../components/RouteIcon/RouteIcon';
import { Link } from '../../../router/Router';

interface Props {
  route: Route;
  agency: Pick<Agency, 'agency_short_name' | 'primary'>;
  class?: string;
  onClick?(evt: MouseEvent): void;
}

export function RouteSearchResultItem(props: Props) {
  const { route, agency } = props;
  return (
    <Link
      href={`/routes/${route.route_id}/`}
      class={clsx('search__item group block p-2 text-white', props.class)}
      onClick={props.onClick}
      role="option"
      tabIndex={-1}
    >
      <RouteIcon style={colorVariables(route)}>
        {route.route_short_name}
      </RouteIcon>
      <p className="mt-2 text-sm group-hover:underline">
        {route.route_long_name}
      </p>
      {agency.primary ? undefined : (
        <p className="text-xs">{agency.agency_short_name}</p>
      )}
    </Link>
  );
}
