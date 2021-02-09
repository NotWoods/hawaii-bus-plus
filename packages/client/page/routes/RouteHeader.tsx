import { Route } from '@hawaii-bus-plus/types';
import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { CloseButton } from '../page-wrapper/alert/CloseButton';
import { closeRouteAction } from '../router/action';
import { RouterContext } from '../router/Router';
import { BLANK } from './badge/RouteBadge';
import { RouteIcon } from './badge/RouteIcon';
import { colorVariables } from './props';

interface Props {
  route?: Pick<
    Route,
    'route_short_name' | 'route_long_name' | 'route_text_color' | 'route_color'
  >;
}

export function RouteHeader({ route }: Props) {
  const { dispatch } = useContext(RouterContext);

  return (
    <header style={route ? colorVariables(route) : undefined}>
      <RouteIcon>{route?.route_short_name ?? '...'}</RouteIcon>
      <h2>{route?.route_long_name ?? BLANK}</h2>
      <CloseButton onClick={() => dispatch(closeRouteAction())} />
    </header>
  );
}
