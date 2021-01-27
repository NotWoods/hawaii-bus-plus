import { useGoogleMap } from '@hawaii-bus-plus/react-google-maps';
import React from 'react';
import { useAlerts } from '../alert/StickyAlerts';
import { useApi } from '../hooks/useApi';
import directionsIcon from '../icons/directions.svg';
import locationIcon from '../icons/gps_fixed.svg';
import { Icon } from '../icons/Icon';
import { getCurrentPosition } from '../map/location/geolocation';
import { RouteSearchItem } from './SearchItems';
import { SidebarTitle } from './SidebarTitle';

interface Props {
  setPosition(position: GeolocationPosition): void;
  onDirectionsClick?(): void;
}

export function DefaultRoutes(props: Props) {
  const api = useApi();
  const routes = api?.routes || [];

  return (
    <>
      <div className="sidebar-content">
        <MyLocationButton setPosition={props.setPosition} />

        <button
          className="btn btn-sm"
          type="button"
          onClick={props.onDirectionsClick}
        >
          <Icon src={directionsIcon} alt="" /> Directions
        </button>
      </div>

      <SidebarTitle>Routes</SidebarTitle>
      {routes.map((route) => (
        <RouteSearchItem key={route.route_id} route={route} />
      ))}
    </>
  );
}

const errorMessages = {
  0: 'Could not show your location because permission was denied',
  1: 'Failed to get your location',
};

function MyLocationButton(props: Pick<Props, 'setPosition'>) {
  const toastAlert = useAlerts();
  const map = useGoogleMap();

  async function handleClick() {
    try {
      const pos = await getCurrentPosition();
      props.setPosition(pos);
      map?.setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    } catch (err) {
      if (err.code) {
        toastAlert({
          alertType: 'alert-danger',
          title: 'Geolocation error',
          children: errorMessages[err.code as 0 | 1],
        });
      } else {
        throw err;
      }
    }
  }

  return (
    <button className="btn btn-sm" type="button" onClick={handleClick}>
      <Icon src={locationIcon} alt="" /> My location
    </button>
  );
}
