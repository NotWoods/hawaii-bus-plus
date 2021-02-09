import { h, Fragment } from 'preact';
import type { SearchResults } from '../../../worker-search/search-db';
import {
  PlaceSearchResultItem,
  StopSearchResultItem,
} from './MarkerSearchResultItem';
import { RouteSearchResultItem } from './RouteSearchResultItem';
import { SearchResultsSubList } from './SearchResultsSubList';

interface Props extends SearchResults {
  forceTitles?: boolean;
  onStopClick?(stop: SearchResults['stops'][number]): void;
  onPlaceClick?(stop: SearchResults['places'][number]): void;
}

export function SearchResultsList(props: Props) {
  const { forceTitles = true, routes, stops, places } = props;
  return (
    <>
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
    </>
  );
}
