import type { Route, Stop } from '@hawaii-bus-plus/types';
import clsx from 'clsx';
import type { ComponentChildren } from 'preact';
import { Icon } from '../../../../assets/icons/Icon';
import { bus_stop, place } from '../../../../assets/icons/paths';
import {
  BLANK,
  RouteBadges,
  type RouteBadgeKeys,
} from '../../../sheet/routes/badge/RouteBadge';
import './SearchResultItem.css';

interface MarkerProps {
  href?: string;
  icon: ComponentChildren;
  title?: ComponentChildren;
  subtitle?: ComponentChildren;
  badges?: ComponentChildren;
  class?: string;
  onClick?(evt: MouseEvent): void;
}

function MarkerSearchResultItem(props: MarkerProps) {
  const Button = props.href ? 'a' : 'button';
  return (
    <li role="option">
      <Button
        type={props.href ? undefined : 'button'}
        href={props.href}
        class={clsx(
          'search__item search__item--marker group grid gap-x-2 py-1 text-white',
          props.class,
        )}
        role="option"
        tabIndex={-1}
        onClick={props.onClick}
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
      </Button>
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
      icon={<Icon src={bus_stop} alt="Bus stop" class="invert" />}
      title={stopName}
      subtitle={stopDesc}
      badges={<RouteBadges routes={routes} />}
    />
  );
}

interface PlaceProps extends BaseProps {
  placeId: string;
  text: google.maps.places.StructuredFormatting;
}

export function PlaceSearchResultItem({ placeId, text, ...props }: PlaceProps) {
  return (
    <MarkerSearchResultItem
      {...props}
      href={`?place=${placeId}`}
      icon={<Icon src={place} alt="Place" class="invert" />}
      title={text.main_text}
      subtitle={text.secondary_text}
    />
  );
}
