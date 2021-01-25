import { Agency, Route } from '@hawaii-bus-plus/types';
import React, { Fragment } from 'react';
import { Icon } from '../icons/Icon';
import fareIcon from '../icons/monetization_on.svg';
import webIcon from '../icons/web.svg';
import './RouteSheet.css';

interface Props {
  route?: Route;
  agency?: Agency;
  descParts?: readonly {
    type: 'text' | 'link';
    value: string;
  }[];
}

export function RouteDetailsCard({ route, agency, descParts }: Props) {
  if (!route || !agency) {
    return <div className="card" />;
  }

  return (
    <div className="card">
      <p>{`Bus route operated by ${agency.agency_name}`}</p>
      <div className="btn-group flex-wrap" role="group">
        <a className="btn" href={agency.agency_url}>
          <Icon src={webIcon} alt="" /> Route webpage
        </a>
        <a className="btn" href={agency.agency_fare_url}>
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
