import { h } from 'preact';
import type { SearchResults } from '../../../../worker-search';
import {
  PlaceSearchResultItem,
  StopSearchResultItem,
} from './MarkerSearchResultItem';
import { RouteSearchResultItem } from './RouteSearchResultItem';
import { SearchResultsSubList } from './SearchResultsSubList';

interface Props extends SearchResults {
  id?: string;
  forceTitles?: boolean;
  onKeyDown?(event: KeyboardEvent): void;
  onStopClick?(stop: SearchResults['stops'][number]): void;
  onPlaceClick?(stop: SearchResults['places'][number]): void;
}

export function SearchResultsList(props: Props) {
  const { id, forceTitles = true, routes, stops, places } = props;
  return (
    <div role="listbox" id={id} onKeyDown={props.onKeyDown}>
      <SearchResultsSubList
        forceTitles={forceTitles}
        title="Routes"
        list={routes}
        child={(route) => (
          <RouteSearchResultItem
            key={route.route_id}
            route={route}
            agency={route.agency}
          />
        )}
      />
      <SearchResultsSubList
        forceTitles={forceTitles}
        title="Stops"
        list={stops}
        child={(stop) => (
          <StopSearchResultItem
            key={stop.stop_id}
            stopId={stop.stop_id}
            stopName={stop.stop_name}
            routes={stop.routes}
            onClick={(evt) => {
              if (props.onStopClick) {
                evt.preventDefault();
                props.onStopClick(stop);
              }
            }}
          />
        )}
      />
      <SearchResultsSubList
        forceTitles={forceTitles}
        title="Other places"
        list={places}
        child={(place) => (
          <PlaceSearchResultItem
            key={place.place_id}
            placeId={place.place_id}
            text={place.structured_formatting}
            onClick={(evt) => {
              if (props.onPlaceClick) {
                evt.preventDefault();
                props.onPlaceClick(place);
              }
            }}
          />
        )}
      />
    </div>
  );
}
