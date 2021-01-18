import React from 'react';
import { Route } from '../../shared/gtfs-types';
import { useApi } from '../data/Api';
import { Icon } from '../icons/Icon';
import './RouteSheet.css';
import webIcon from '../icons/web.svg';
import fareIcon from '../icons/monetization_on.svg';

interface Props {
  route: Route;
}

export function RouteDetails({ route }: Props) {
  const api = useApi();
  const agency = api?.agency?.[route.agency_id];

  return (
    <div className="card">
      <p>
        {agency ? `Bus route operated by ${agency.agency_name}` : 'Bus route'}
      </p>
      <div className="btn-group flex-wrap" role="group">
        <a className="btn" href={agency?.agency_url}>
          <Icon src={webIcon} alt="" /> Route webpage
        </a>
        <a className="btn" href={agency?.agency_fare_url}>
          <Icon src={fareIcon} alt="" /> Fare info
        </a>
      </div>
      <p className="text-muted">{route.route_desc}</p>
    </div>
  );
}
