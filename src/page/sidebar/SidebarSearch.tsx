import React, { useEffect, useState } from 'react';
import { center } from '../../react-google-maps';
import SearchWorker from '../../search-worker/index?worker';
import type { SearchResults } from '../../search-worker/search';
import { PromiseWorker } from '../../shared/promise-worker';
import { makeId } from '../alert/make';
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
