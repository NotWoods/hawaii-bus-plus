import { Route, Stop } from '@hawaii-bus-plus/types';
import { h } from 'preact';

export interface Props {
  route: Route;
  stops: Iterable<Stop>;
  width: number;
  height: number;
}

export function StaticMap({ route, stops, width, height }: Props) {
  const url = new URL('https://maps.googleapis.com/maps/api/staticmap');

  const markers = Array.from(
    stops,
    (stop) => `${stop.position.lat},${stop.position.lng}`
  );
  markers.unshift(
    `size:tiny|color:0x${route.route_color.slice(1).toUpperCase()}`
  );
  console.log(markers[0]);
  url.searchParams.set('markers', markers.join('|'));
  url.searchParams.set('key', import.meta.env.VITE_GOOGLE_MAPS_KEY as string);
  url.searchParams.set('size', `${width}x${height}`);

  const doubleSize = new URL(url.href);
  doubleSize.searchParams.set('scale', '2');

  return (
    <img
      class="mx-auto py-6"
      width={width}
      height={height}
      src={url.href}
      srcset={`${doubleSize.href} 2x, ${url.href} 1x`}
      alt="Map displaying bus stops in this route"
    />
  );
}
