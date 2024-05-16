import type { Route, Stop } from '@hawaii-bus-plus/types';

import { GOOGLE_MAPS_KEY } from '../../services/env';

interface UrlProps {
  route: Route;
  stops: Iterable<Stop>;
  width: number;
  height: number;
}

interface Props {
  url: string;
  width: number;
  height: number;
}

export function staticMapUrl({ route, stops, width, height }: UrlProps) {
  const url = new URL('https://maps.googleapis.com/maps/api/staticmap');

  const markers = Array.from(
    stops,
    (stop) => `${stop.position.lat},${stop.position.lng}`,
  );
  markers.unshift(
    `size:tiny|color:0x${route.route_color.slice(1).toUpperCase()}`,
  );
  url.searchParams.set('markers', markers.join('|'));
  url.searchParams.set('key', GOOGLE_MAPS_KEY);
  url.searchParams.set('size', `${width}x${height}`);

  return url.href;
}

export function StaticMap({ url, width, height }: Props) {
  const doubleSize = new URL(url);
  doubleSize.searchParams.set('scale', '2');

  return (
    <img
      class="mx-auto py-6"
      width={width}
      height={height}
      src={url}
      srcset={`${doubleSize.href} 2x, ${url} 1x`}
      alt="Map displaying bus stops in this route"
    />
  );
}
