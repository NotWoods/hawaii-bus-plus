import { useGoogleMap } from '@hawaii-bus-plus/react-google-maps';
import React, { useState } from 'react';
import type { SearchResults } from '../../../worker-search/search';
import { usePromise } from '../../hooks/usePromise';
import { useWorker } from '../../hooks/useWorker';
import { makeId } from '../../page-wrapper/alert/make';
import SearchWorker from '../../worker-search/index?worker';
import {
  PlaceSearchItem,
  RouteSearchItem,
  StopSearchItem,
} from '../SearchItems';
import { SidebarTitle } from '../SidebarTitle';
import { emptyResults, search } from './places-autocomplete';
import './Sidebar.css';

interface Props {
  search: string;
}

export const sessionToken = makeId(10);

export function SidebarSearch(props: Props) {
  const map = useGoogleMap();
  const [searchResults, setSearchResults] = useState(emptyResults);
  const postToSearchWorker = useWorker(SearchWorker);

  usePromise(async () => {
    const results = await search(map, postToSearchWorker as any, {
      input: props.search,
      offset: props.search.length,
    });

    setSearchResults(results as SearchResults);
  }, [props.search]);

  return (
    <>
      <SidebarTitle>Routes</SidebarTitle>
      {searchResults.routes.map((route) => (
        <RouteSearchItem key={route.route_id} route={route} />
      ))}

      <SidebarTitle>Stops</SidebarTitle>
      {searchResults.stops.map((stop) => (
        <StopSearchItem
          key={stop.stop_id}
          stopId={stop.stop_id}
          stopName={stop.stop_name}
          routes={stop.routes}
        />
      ))}

      <SidebarTitle>Other places</SidebarTitle>
      {searchResults.places.map((place) => (
        <PlaceSearchItem
          placeId={place.place_id}
          text={place.structured_formatting}
        />
      ))}
    </>
  );
}
