import React, { useEffect, useState } from 'react';
import { SidebarTitle } from './SidebarTitle';
import './Sidebar.css';
import {
  PlaceSearchItem,
  RouteSearchItem,
  StopSearchItem,
} from './SearchItems';
import { PromiseWorker } from '../../shared/promise-worker';
import type { SearchResults } from '../../search-worker/search';
import SearchWorker from '../../search-worker/index?worker';
import { makeId } from '../alert/make';
import { center } from '../map/options';

interface Props {
  search: string;
}

const sessiontoken = makeId(10);
const searchWorker = new PromiseWorker(new SearchWorker());

export function SidebarSearch(props: Props) {
  const [searchResults, setSearchResults] = useState<SearchResults>({
    places: [],
    routes: [],
    stops: [],
  });

  useEffect(() => {
    searchWorker
      .postMessage({
        key: 'AIzaSyAmRiFwEOokwUHYXK1MqYl5k2ngHoWGJBw',
        input: props.search,
        offset: props.search.length,
        sessiontoken,
        location: center,
      })
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
