import { Route } from '@hawaii-bus-plus/types';
import { h } from 'preact';
import { RouteIcon } from '../../../all-pages/components/RouteIcon';
import { CloseButton } from '../../buttons/CloseButton';
import { closeMainAction } from '../../router/action/main';
import { useDispatch } from '../../router/hooks';
import { BLANK } from './badge/RouteBadge';
import './RouteHeader.css';

interface Props {
  route?: Pick<
    Route,
    'route_short_name' | 'route_long_name' | 'route_text_color' | 'route_color'
  >;
  showClose?: boolean;
}

export function RouteHeader({ route, showClose }: Props) {
  const dispatch = useDispatch();

  return (
    <header class="route__header grid gap-x-4 items-center px-4 pb-2 md:pb-0 border-b">
      <RouteIcon>{route?.route_short_name ?? BLANK}</RouteIcon>
      <h2 class="font-display text-3xl" style={{ gridArea: 'name' }}>
        {route?.route_long_name ?? BLANK}
      </h2>
      {showClose ? (
        <CloseButton onClick={() => dispatch(closeMainAction())} />
      ) : null}
    </header>
  );
}
