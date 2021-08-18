import { Agency } from '@hawaii-bus-plus/types';
import { ComponentChildren, Fragment, h } from 'preact';
import { ButtonOrAnchor } from '../Button/ButtonOrAnchor';

export interface DescriptionPart {
  type: 'text' | 'link';
  value: string;
}

interface Props {
  agency: Agency;
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

export function RouteDescription({ agency, descParts }: Props) {
  return (
    <>
      <p class="mb-2 text-black dark:text-white">
        {'Bus route operated by '}
        <DetailsLink href={agency.agency_url}>{agency.agency_name}</DetailsLink>
        .
      </p>
      <p class="text-sm leading-relaxed max-w-none text-black dark:text-white text-opacity-75 break-words">
        {descParts?.map(renderDescriptionPart)}
      </p>
    </>
  );
}
