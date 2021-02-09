import { Route, Stop } from '@hawaii-bus-plus/types';
import { ComponentChildren, h } from 'preact';
import busStopIcon from '../../icons/bus_stop.svg';
import placeIcon from '../../icons/place.svg';
import { classNames } from '../../hooks/classnames';
import { RouterAction } from '../../router/action';
import { Link } from '../../router/Router';
import {
  BLANK,
  RouteBadgeKeys,
  RouteBadges,
} from '../../routes/badge/RouteBadge';
import { IconTw } from '../../icons/Icon';

interface MarkerProps {
  href?: string;
  icon: ComponentChildren;
  title?: ComponentChildren;
  subtitle?: ComponentChildren;
  class?: string;
  action?: RouterAction;
  onClick?(evt: MouseEvent): void;
}

const gridTemplate = `
  'icon title' auto
  'icon subtitle' auto
  / 2rem auto`;

function MarkerSearchResultItem(props: MarkerProps) {
  return (
    <li>
      <Link
        action={props.action}
        href={props.href}
        class={classNames('grid gap-x-2 gap-y-1 py-1 text-white', props.class)}
        onClick={props.onClick}
        style={{ gridTemplate }}
      >
        <span
          class="rounded bg-gray-900 self-start p-1"
          style={{ gridArea: 'icon' }}
        >
          {props.icon}
        </span>
        <p className="text-sm">{props.title}</p>
        <p className="text-xs">{props.subtitle}</p>
      </Link>
    </li>
  );
}

type BaseProps = Pick<MarkerProps, 'class' | 'action' | 'onClick'>;

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
      icon={<IconTw src={busStopIcon} alt="Bus stop" class="filter-invert" />}
      title={stopName}
      subtitle={stopDesc ?? <RouteBadges routes={routes} />}
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
      icon={<IconTw src={placeIcon} alt="Place" class="filter-invert" />}
      title={text.main_text}
      subtitle={text.secondary_text}
    />
  );
}
