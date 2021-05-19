import { Route, Stop } from '@hawaii-bus-plus/types';
import clsx, { ClassValue } from 'clsx';
import { ComponentChildren, h } from 'preact';
import { ButtonOrAnchor } from '../../buttons/ButtonOrAnchor';
import busStopIcon from '../../icons/bus_stop.svg';
import { Icon } from '../../icons/Icon';
import placeIcon from '../../icons/place.svg';
import {
  BLANK,
  RouteBadgeKeys,
  RouteBadges,
} from '../../routes/badge/RouteBadge';

interface MarkerProps {
  href?: string;
  icon: ComponentChildren;
  title?: ComponentChildren;
  subtitle?: ComponentChildren;
  badges?: ComponentChildren;
  class?: ClassValue;
  onClick?(evt: MouseEvent): void;
}

const gridTemplate = `
  'icon title' auto
  'icon subtitle' min-content
  'icon badges' min-content
  / 2rem auto`;

function MarkerSearchResultItem(props: MarkerProps) {
  return (
    <li>
      <ButtonOrAnchor
        href={props.href}
        class={clsx('group grid gap-x-2 py-1 text-white', props.class)}
        onClick={props.onClick}
        style={{ gridTemplate }}
      >
        <span
          class="rounded bg-primary-900 self-start p-1 mb-1"
          style={{ gridArea: 'icon' }}
        >
          {props.icon}
        </span>
        <p className="text-sm group-hover:underline">{props.title}</p>
        <p className="text-xs">{props.subtitle}</p>
        {props.badges && <p className="text-xs mt-1">{props.badges}</p>}
      </ButtonOrAnchor>
    </li>
  );
}

type BaseProps = Pick<MarkerProps, 'class' | 'onClick'>;

interface StopProps extends BaseProps {
  stopId: Stop['stop_id'];
  stopName?: string;
  stopDesc?: string;
  routes?: readonly Pick<Route, RouteBadgeKeys>[];
}

export function StopSearchResultItem({
  stopId,
  stopName = BLANK,
  stopDesc,
  routes,
  ...props
}: StopProps) {
  return (
    <MarkerSearchResultItem
      {...props}
      href={`?stop=${stopId}`}
      icon={<Icon src={busStopIcon} alt="Bus stop" class="filter invert" />}
      title={stopName}
      subtitle={stopDesc}
      badges={<RouteBadges routes={routes} />}
    />
  );
}

interface PlaceProps extends BaseProps {
  placeId: string;
  text: google.maps.places.AutocompleteStructuredFormatting;
}

export function PlaceSearchResultItem({ placeId, text, ...props }: PlaceProps) {
  return (
    <MarkerSearchResultItem
      {...props}
      href={`?place=${placeId}`}
      icon={<Icon src={placeIcon} alt="Place" class="filter invert" />}
      title={text.main_text}
      subtitle={text.secondary_text}
    />
  );
}
