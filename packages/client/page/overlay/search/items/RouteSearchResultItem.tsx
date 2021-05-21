import { Agency, Route } from '@hawaii-bus-plus/types';
import clsx, { ClassValue } from 'clsx';
import { h } from 'preact';
import { RouteIcon } from '../../../../all-pages/components/RouteIcon';
import { colorVariables } from '../../../../all-pages/route-colors';
import { Link } from '../../../router/Router';

interface Props {
  route: Route;
  agency: Pick<Agency, 'agency_name' | 'primary'>;
  class?: ClassValue;
  onClick?(evt: MouseEvent): void;
}

export function RouteSearchResultItem(props: Props) {
  const { route, agency } = props;
  return (
    <Link
      href={`/routes/${route.route_id}/`}
      class={clsx('group block p-2 text-white', props.class)}
      onClick={props.onClick}
    >
      <RouteIcon style={colorVariables(route)}>
        {route.route_short_name}
      </RouteIcon>
      <p className="mt-2 text-sm group-hover:underline">
        {route.route_long_name}
      </p>
      {agency.primary ? undefined : (
        <p className="text-xs">{agency.agency_name}</p>
      )}
    </Link>
  );
}
