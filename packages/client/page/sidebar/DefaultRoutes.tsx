import { h, Fragment } from 'preact';
import { useApi } from '../hooks/useApi';
import directionsIcon from '../icons/directions.svg';
import { Icon } from '../icons/Icon';
import { MyLocationButton } from '../map/location/MyLocationButton';
import { RouteListItem } from '../routes/link/RouteListItem';
import { SidebarTitle } from './SidebarTitle';

interface Props {
  onDirectionsClick?(): void;
}

export function DefaultRoutes(props: Props) {
  const api = useApi();
  const routes = api?.routes ?? [];

  return (
    <>
      <div className="sidebar-content">
        <MyLocationButton />

        <button
          className="btn btn-sm"
          type="button"
          onClick={props.onDirectionsClick}
        >
          <Icon small src={directionsIcon} alt="" /> Directions
        </button>
      </div>

      <SidebarTitle>Routes</SidebarTitle>
      {routes.map((route) => (
        <RouteListItem
          key={route.route_id}
          route={route}
          agency={api!.agency[route.agency_id]}
        />
      ))}
    </>
  );
}
