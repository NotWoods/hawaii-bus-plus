import type { Point } from '@hawaii-bus-plus/presentation';

import type { SearchResults } from '@hawaii-bus-plus/workers/search';
import { getDetails, usePlacesService } from '../../../hooks/usePlacesService';
import { SearchResultsList } from '../items/SearchResultsList';

interface Props {
  field: 'depart' | 'arrive';
  results: SearchResults;
  clearResults(field: 'depart' | 'arrive'): void;
  setDepart(point: Point): void;
  setArrive(point: Point): void;
  onKeyDown?(event: KeyboardEvent): void;
}

export function DirectionsPointResults(props: Props) {
  const service = usePlacesService();

  const fieldSetter = {
    depart: props.setDepart,
    arrive: props.setArrive,
  }[props.field];

  return (
    <SearchResultsList
      id={`searchResults_${props.field}`}
      forceTitles={false}
      favorites={props.results.favorites}
      routes={[]}
      stops={props.results.stops}
      places={props.results.places}
      onKeyDown={props.onKeyDown}
      onStopClick={(stop) => {
        fieldSetter({
          type: 'stop',
          stopId: stop.stop_id,
          name: stop.stop_name,
        });
        props.clearResults(props.field);
      }}
      onPlaceClick={async (place) => {
        props.clearResults(props.field);

        const details = await getDetails(service!, {
          placeId: place.place_id,
          fields: ['geometry.location'],
        });
        fieldSetter({
          type: 'place',
          placeId: place.place_id,
          name: place.structured_formatting.main_text,
          position: details.geometry!.location!.toJSON(),
        });
      }}
    />
  );
}
