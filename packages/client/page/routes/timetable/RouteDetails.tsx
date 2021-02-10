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
    <aside class="bg-white dark:bg-gray-700 shadow-inner px-4 pt-6 pb-8">
      <div class="flex flex-wrap gap-1 justify-center mb-4">
        <ButtonLink
          icon={fareIcon}
          iconClass="dark:filter-invert"
          href={agency.agency_fare_url}
        >
          Fare info
        </ButtonLink>
        <ButtonLink
          icon={webIcon}
          iconClass="dark:filter-invert"
          href={agency.agency_url}
        >
          Route webpage
        </ButtonLink>
      </div>
      <p class="mb-2 text-black dark:text-white">
        {'Bus route operated by '}
        <a href={agency.agency_url} class="text-current hover:underline">
          {agency.agency_name}
        </a>
        .
      </p>
      <p class="text-sm leading-relaxed max-w-none text-black dark:text-white text-opacity-75 break-words">
        {descParts?.map((part, i) =>
          part.type === 'link' ? (
            <a key={i} href={part.value} class="hover:underline">
              {part.value}
            </a>
          ) : (
            <Fragment key={i}>{part.value}</Fragment>
          )
        )}
      </p>
    </aside>
  );
}
