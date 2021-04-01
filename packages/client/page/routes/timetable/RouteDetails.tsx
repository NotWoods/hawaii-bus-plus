import { Agency, Route } from '@hawaii-bus-plus/types';
import { ComponentChildren, Fragment, h } from 'preact';
import type { DescriptionPart } from '../../../worker-info/description';
import { Button } from '../../buttons/Button';
import { ButtonOrAnchor } from '../../buttons/ButtonOrAnchor';
import fareIcon from '../../icons/monetization_on.svg';
import shareIcon from '../../icons/share.svg';
import webIcon from '../../icons/web.svg';

interface Props {
  route?: Route;
  agency?: Agency;
  descParts?: readonly DescriptionPart[];
}

function DetailsLink(props: { href: string; children: ComponentChildren }) {
  return <ButtonOrAnchor {...props} class="text-current hover:underline" />;
}

function renderDescriptionPart(part: DescriptionPart, index: number) {
  if (part.type === 'link') {
    return (
      <DetailsLink key={index} href={part.value}>
        {part.value}
      </DetailsLink>
    );
  } else {
    return <Fragment key={index}>{part.value}</Fragment>;
  }
}

export function RouteDetailsCard({ route, agency, descParts }: Props) {
  if (!route || !agency) {
    return null;
  }

  return (
    <footer class="bg-white dark:bg-gray-700 shadow-inner px-4 pt-6 pb-8">
      <div class="flex flex-wrap gap-1 justify-center mb-4">
        <Button
          icon={shareIcon}
          iconClass="dark:filter-invert"
          href={`https://hibus.plus/routes/${route.route_id}`}
        >
          Share
        </Button>
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
        {descParts?.map(renderDescriptionPart)}
      </p>
    </footer>
  );
}
