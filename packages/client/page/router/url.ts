import { PlacePointPartial, Point } from '@hawaii-bus-plus/presentation';
import { Stop } from '@hawaii-bus-plus/types';
import { toInt } from '@hawaii-bus-plus/utils';
import { OpenDirectionsState } from './state/main';

export function pointToQuery(point: Point | PlacePointPartial) {
  switch (point.type) {
    case 'stop':
      return `stop:${point.stopId}`;
    case 'place':
      return `place:${point.placeId}`;
    default:
      return `${point.position.lat},${point.position.lng}`;
  }
}

export function queryToPoint(
  query: string | null
): Point | PlacePointPartial | undefined {
  if (!query) {
    return undefined;
  } else if (query.includes(':')) {
    const [type, id] = query.split(':');
    if (type === 'stop') {
      return { type, stopId: id as Stop['stop_id'] };
    } else if (type === 'place') {
      return { type, placeId: id };
    } else {
      return undefined;
    }
  } else if (query.includes(',')) {
    const [lat, lng] = query.split(',').map(toInt);
    return { type: 'marker', position: { lat, lng } };
  } else {
    return undefined;
  }
}

export function directionsToParams(
  directions: Omit<OpenDirectionsState, 'path'>,
  params = new URLSearchParams()
) {
  params.set('from', pointToQuery(directions.depart));
  params.set('to', pointToQuery(directions.arrive));
  params.set('depart', directions.departureTime);
  return params;
}
