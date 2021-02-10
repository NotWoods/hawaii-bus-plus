import { Agency, Route } from '@hawaii-bus-plus/types';
import { Fragment, h } from 'preact';
import { ButtonLink } from '../../buttons/Button';
import fareIcon from '../../icons/monetization_on.svg';
import webIcon from '../../icons/web.svg';

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
    return null;
  }

  return (
    <>
      <p class="m-4">
        {'Bus route operated by '}
        {agency.agency_name}
      </p>
      <div class="m-4" role="group">
        <ButtonLink icon={webIcon} href={agency.agency_url}>
          Route webpage
        </ButtonLink>
        <ButtonLink icon={fareIcon} href={agency.agency_fare_url}>
          Fare info
        </ButtonLink>
      </div>
      <p class="prose m-4 max-w-none text-black dark:text-white text-opacity-75 break-words">
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
    </>
  );
}
