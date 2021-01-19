import { dbReady, SearchRoute, SearchStop } from '../data/database';
import { Route, Stop } from '../shared/gtfs-types';
import { registerPromiseWorker } from '../worker-base/register';

interface RouteInfoMessage {
  type: 'route';
  id: Route['route_id'];
}

interface StopInfoMessage {
  type: 'stop';
  id: Stop['stop_id'];
}

interface PlaceInfoMessage {
  type: 'place';
  id: string;
  key: string;
  sessionToken: string;
}

type Message = RouteInfoMessage | StopInfoMessage | PlaceInfoMessage;

registerPromiseWorker(async (message: Message) => {
  switch (message.type) {
    case 'route': {
      const db = await dbReady;
      const route: (Route & Partial<SearchRoute>) | undefined = await db.get(
        'routes',
        message.id
      );
      delete route?.words;
      return route;
    }
    case 'stop': {
      const db = await dbReady;
      const stop: (Stop & Partial<SearchStop>) | undefined = await db.get(
        'stops',
        message.id
      );
      delete stop?.words;
      return stop;
    }
    case 'place': {
      const url = new URL(
        'https://maps.googleapis.com/maps/api/place/details/json'
      );
      url.searchParams.set('key', message.key);
      url.searchParams.set('place_id', message.id);
      url.searchParams.set('sessiontoken', message.sessionToken);
      url.searchParams.set(
        'fields',
        'formatted_address,name,geometry,place_id'
      );

      const res = await fetch(url.href);
      const json: google.maps.places.PlaceResult = await res.json();
      return json;
    }
  }
});
