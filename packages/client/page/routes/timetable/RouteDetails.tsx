import { Agency, Route } from '@hawaii-bus-plus/types';
import { ComponentChildren, Fragment, h } from 'preact';
import { Button } from '../../buttons/Button';
import { ButtonOrAnchor } from '../../buttons/ButtonOrAnchor';
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

function DetailsLink(props: { href: string; children: ComponentChildren }) {
  return <ButtonOrAnchor {...props} class="text-current hover:underline" />;
}

export function RouteDetailsCard({ route, agency, descParts }: Props) {
  if (!route || !agency) {
    return null;
  }

  return (
    <aside class="bg-white dark:bg-gray-700 shadow-inner px-4 pt-6 pb-8">
      <div class="flex flex-wrap gap-1 justify-center mb-4">
        <Button
          icon={fareIcon}
          iconClass="dark:filter-invert"
          href={agency.agency_fare_url}
        >
          Fare info
        </Button>
        <Button
          icon={webIcon}
          iconClass="dark:filter-invert"
          href={agency.agency_url}
        >
          Route webpage
        </Button>
      </div>
      <p class="mb-2 text-black dark:text-white">
        {'Bus route operated by '}
        <DetailsLink href={agency.agency_url}>{agency.agency_name}</DetailsLink>
        .
      </p>
      <p class="text-sm leading-relaxed max-w-none text-black dark:text-white text-opacity-75 break-words">
        {descParts?.map((part, i) =>
          part.type === 'link' ? (
            <DetailsLink key={i} href={part.value}>
              {part.value}
            </DetailsLink>
          ) : (
            <Fragment key={i}>{part.value}</Fragment>
          )
        )}
      </p>
    </aside>
  );
}
