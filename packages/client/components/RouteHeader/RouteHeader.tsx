import { Route } from '@hawaii-bus-plus/types';

import { CloseButton } from '../Button/CloseButton';
import { RouteIcon } from '../RouteIcon/RouteIcon';
import { BLANK } from '../RouteBadge/constants';
import './RouteHeader.css';

interface Props {
  route?: Pick<
    Route,
    'route_short_name' | 'route_long_name' | 'route_text_color' | 'route_color'
  >;
  onClose?(event: MouseEvent): void;
}

export function RouteHeader({ route, onClose }: Props) {
  return (
    <header class="route__header grid gap-x-4 items-center px-4 pb-2 md:pb-0 border-b">
      <RouteIcon>{route?.route_short_name ?? BLANK}</RouteIcon>
      <h2 class="font-display text-3xl" style={{ gridArea: 'name' }}>
        {route?.route_long_name ?? BLANK}
      </h2>
      {onClose ? <CloseButton onClick={onClose} /> : null}
    </header>
  );
}
