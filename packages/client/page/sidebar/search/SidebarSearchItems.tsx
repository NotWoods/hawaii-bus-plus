import { h, Fragment } from 'preact';
import { SearchResults } from '../../../worker-search/search-db';
import { RouteListItem } from '../../routes/link/RouteListItem';
import { PlaceSearchItem, StopSearchItem } from '../SearchItems';
import { SidebarTitle } from '../SidebarTitle';

interface Props extends SearchResults {
  forceTitles?: boolean;
  onStopClick?(stop: SearchResults['stops'][number]): void;
  onPlaceClick?(stop: SearchResults['places'][number]): void;
}

export function SidebarSearchItems(props: Props) {
  const { forceTitles = true, routes, stops, places } = props;
  return (
    <>
      {forceTitles || routes.length > 0 ? (
        <SidebarTitle>Routes</SidebarTitle>
      ) : null}
      {routes.map((route) => (
        <RouteListItem
          key={route.route_id}
          route={route}
          agency={route.agency}
        />
      ))}

      {forceTitles || stops.length > 0 ? (
        <SidebarTitle>Stops</SidebarTitle>
      ) : null}
      {stops.map((stop) => (
        <StopSearchItem
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
      ))}

      {forceTitles || places.length > 0 ? (
        <SidebarTitle>Other places</SidebarTitle>
      ) : null}
      {places.map((place) => (
        <PlaceSearchItem
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
      ))}
    </>
  );
}
