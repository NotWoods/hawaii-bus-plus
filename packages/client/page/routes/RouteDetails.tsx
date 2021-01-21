import React, { Fragment } from 'react';
import { Route } from '@hawaii-bus-plus/types';
import { useApi } from '../data/Api';
import { Icon } from '../icons/Icon';
import './RouteSheet.css';
import webIcon from '../icons/web.svg';
import fareIcon from '../icons/monetization_on.svg';

interface Props {
  route?: Route;
  descParts?: readonly {
    type: 'text' | 'link';
    value: string;
  }[];
}

export function RouteDetailsCard({ route, descParts }: Props) {
  const api = useApi();

  if (!route) {
    return <div className="card" />;
  }

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
      <p className="text-muted text-break">
        {descParts?.map((part, i) =>
          part.type === 'link' ? (
            <a key={i} href={part.value}>
              {part.value}
            </a>
          ) : (
            <Fragment key={i}>{part.value}</Fragment>
          )
        )}
      </p>
    </div>
  );
}
