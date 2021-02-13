import { Route } from '@hawaii-bus-plus/types';
import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { CloseButton } from '../buttons/CloseButton';
import { closeRouteAction } from '../router/action';
import { RouterContext } from '../router/Router';
import { BLANK } from './badge/RouteBadge';
import { RouteIcon } from './badge/RouteIcon';
import './RouteHeader.css';

interface Props {
  route?: Pick<
    Route,
    'route_short_name' | 'route_long_name' | 'route_text_color' | 'route_color'
  >;
}

export function RouteHeader({ route }: Props) {
  const { dispatch } = useContext(RouterContext);

  return (
    <header class="route__header grid gap-x-4 items-center px-4 pb-2 md:pb-0 border-b">
      <RouteIcon>{route?.route_short_name ?? BLANK}</RouteIcon>
      <h2 class="font-display text-3xl" style={{ gridArea: 'name' }}>
        {route?.route_long_name ?? BLANK}
      </h2>
      <CloseButton onClick={() => dispatch(closeRouteAction())} />
    </header>
  );
}
