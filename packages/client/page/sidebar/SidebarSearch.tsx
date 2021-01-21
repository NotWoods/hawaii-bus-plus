import React, { useEffect, useState } from 'react';
import { center } from '@hawaii-bus-plus/react-google-maps';
import SearchWorker from '../../worker-search/index?worker';
import type { SearchResults } from '../../worker-search/search';
import { makeId } from '../alert/make';
import { dbInitialized } from '../data/db-ready';
import { useWorker } from '../hooks/useWorker';
import {
  PlaceSearchItem,
  RouteSearchItem,
  StopSearchItem,
} from './SearchItems';
import './Sidebar.css';
import { SidebarTitle } from './SidebarTitle';

interface Props {
  search: string;
}

export const sessionToken = makeId(10);

export function SidebarSearch(props: Props) {
  const [searchResults, setSearchResults] = useState<SearchResults>({
    places: [],
    routes: [],
    stops: [],
  });

  const searchWorker = useWorker(SearchWorker);

  useEffect(() => {
    dbInitialized
      .then(() =>
        searchWorker?.postMessage({
          key: 'AIzaSyAmRiFwEOokwUHYXK1MqYl5k2ngHoWGJBw',
          input: props.search,
          offset: props.search.length,
          sessiontoken: sessionToken,
          location: center,
        })
      )
      .then((results) => setSearchResults(results as SearchResults));
  }, [props.search]);

  return (
    <>
      <SidebarTitle>Routes</SidebarTitle>
      {searchResults.routes.map((route) => (
        <RouteSearchItem key={route.route_id} route={route} />
      ))}

      <SidebarTitle>Stops</SidebarTitle>
      {searchResults.stops.map((stop) => (
        <StopSearchItem key={stop.stop_id} stop={stop} />
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
