import { Route } from '@hawaii-bus-plus/types';
import { Helmet, HelmetProps } from '@notwoods/preact-helmet';
import { ComponentChildren, h } from 'preact';

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
  return (
    <Helmet
      {...props}
      titleTemplate="%s - Hawaii Bus Plus"
      defaultTitle="Hawaii Bus Plus"
    />
  );
}
