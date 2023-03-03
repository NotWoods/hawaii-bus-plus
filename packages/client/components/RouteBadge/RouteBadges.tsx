import { Route } from '@hawaii-bus-plus/types';

import { BLANK } from './constants';
import { RouteBadge, RouteBadgeKeys } from './RouteBadge';

interface Props {
  routes?: readonly Pick<Route, RouteBadgeKeys>[];
  omit?: Route['route_id'];
  clear?: boolean;
}

/**
 * Displays a list of badges representing routes that a stop connects to.
 */
export function RouteBadges({ routes, omit, clear }: Props) {
  const badges = routes
    ?.filter((route) => route.route_id !== omit)
    ?.map((route) => <RouteBadge key={route.route_id} route={route} />);

  if (!badges || badges.length === 0) {
    return clear ? null : <span class="flex gap-1">{BLANK}</span>;
  } else {
    return <span class="flex gap-1">{badges}</span>;
  }
}
