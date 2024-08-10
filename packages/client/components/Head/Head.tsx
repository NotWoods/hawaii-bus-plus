import type { Route } from '@hawaii-bus-plus/types';
import { Helmet, type HelmetProps } from '@notwoods/preact-helmet';
import type { ComponentChildren } from 'preact';

export const appName = 'Hawaii Bus Plus';

export function routeTitle(route: Route) {
  return `${route.route_short_name} · ${route.route_long_name}`;
}

interface Props extends HelmetProps {
  children: ComponentChildren;
}

/**
 * Set the window title
 */
export function Head(props: Props) {
  return <Helmet {...props} />;
}
