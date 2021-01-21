export interface PlaceInfoMessage {
  type: 'place';
  id: string;
  key: string;
  sessionToken: string;
}

export async function placeApi(message: PlaceInfoMessage) {
  const url = new URL(
    'https://maps.googleapis.com/maps/api/place/details/json'
  );
  url.searchParams.set('key', message.key);
  url.searchParams.set('place_id', message.id);
  url.searchParams.set('sessiontoken', message.sessionToken);
  url.searchParams.set('fields', 'formatted_address,name,geometry,place_id');

  const res = await fetch(url.href);
  const json: google.maps.places.PlaceResult = await res.json();
  return json;
}
