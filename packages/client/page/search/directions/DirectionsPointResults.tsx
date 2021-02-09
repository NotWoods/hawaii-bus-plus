import { Point } from '@hawaii-bus-plus/presentation';
import { h } from 'preact';
import { SearchResults } from '../../../worker-search/search-db';
import { usePlacesService } from '../../hooks/usePlacesService';
import { SearchResultsList } from '../items/SearchResultsList';
import { emptyResults } from '../simple/places-autocomplete';

interface Props {
  field: 'depart' | 'arrive';
  results: SearchResults;
  setResults(results: Pick<Props, 'field' | 'results'>): void;
  setDepart(point: Point): void;
  setArrive(point: Point): void;
}

export function DirectionsPointResults(props: Props) {
  const getPlaceDetails = usePlacesService();

  const fieldSetter = {
    depart: props.setDepart,
    arrive: props.setArrive,
  }[props.field];

  return (
    <SearchResultsList
      forceTitles={false}
      favorites={props.results.favorites}
      routes={[]}
      stops={props.results.stops}
      places={props.results.places}
      onStopClick={(stop) => {
        fieldSetter({
          type: 'stop',
          stopId: stop.stop_id,
          name: stop.stop_name,
        });
        props.setResults({
          field: props.field,
          results: emptyResults,
        });
      }}
      onPlaceClick={async (place) => {
        props.setResults({
          field: props.field,
          results: emptyResults,
        });

        const details = await getPlaceDetails!({
          placeId: place.place_id,
          fields: ['geometry.location'],
        });
        fieldSetter({
          type: 'place',
          placeId: place.place_id,
          name: place.structured_formatting.main_text,
          position: details.geometry!.location.toJSON(),
        });
      }}
    />
  );
}
