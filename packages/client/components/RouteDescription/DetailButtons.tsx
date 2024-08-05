import type { Agency, Route, Trip } from '@hawaii-bus-plus/types';
import clsx from 'clsx';

import { monetization_on, share } from '../../assets/icons/paths';
import { routeShareUrl } from '../../services/share/route-url';
import { OutlinedButton } from '../Button/OutlinedButton';

console.log(monetization_on);

interface Props {
  route: Route;
  agency: Agency;
  tripId?: Trip['trip_id'];
  class?: string;
  onShare?(event: MouseEvent): void;
}

export function DetailButtons({
  route,
  agency,
  tripId,
  class: className,
  onShare,
}: Props) {
  return (
    <div class={clsx('flex flex-wrap gap-1 justify-center', className)}>
      <OutlinedButton
        icon={share}
        iconClass="dark:invert"
        href={routeShareUrl(route.route_id, tripId)}
        onClick={onShare}
        id="share"
      >
        Share
      </OutlinedButton>
      <OutlinedButton
        icon={monetization_on}
        iconClass="dark:invert"
        href={agency.agency_fare_url}
      >
        Fare info
      </OutlinedButton>
    </div>
  );
}
