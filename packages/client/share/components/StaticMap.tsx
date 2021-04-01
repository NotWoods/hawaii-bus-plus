import { Route, Stop } from '@hawaii-bus-plus/types';
import { h } from 'preact';

export interface Props {
  route: Route;
  stops: Iterable<Stop>;
}

export function StaticMap({ route, stops }: Props) {
  const url = new URL('https://maps.googleapis.com/maps/api/staticmap');

  const markers = Array.from(
    stops,
    (stop) => `${stop.position.lat},${stop.position.lng}`
  );
  markers.unshift(`size:tiny|color:${route.route_color}`);
  url.searchParams.set('markers', markers.join('|'));
  url.searchParams.set('key', import.meta.env.VITE_GOOGLE_MAPS_KEY as string);

  return <img src={url.href} alt="Map displaying bus stops in this route" />;
}
