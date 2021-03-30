import clsx from 'clsx';
import { ComponentChildren, h } from 'preact';

const ring = 'ring-1 ring-gray-500 bg-route';
const line = `${ring} block w-8 h-2`;

interface Props {
  children: ComponentChildren;
  class?: string;
  title?: string;
  style?: {
    [key: string]: string | number | null | undefined;
  };
}

/**
 * Displays the route icon as a single box, good for small badges.
 */
export function SmallRouteIcon(props: Props) {
  return (
    <span
      {...props}
      class={clsx(
        ring,
        'font-display font-medium text-center text-route px-1 self-end justify-self-end',
        props.class
      )}
    />
  );
}

/**
 * Displays the route icon as a large box with a crossroad line,
 * good for representing the route individually.
 */
export function RouteIcon(props: Props) {
  return (
    <div class="flex items-center" {...props}>
      <span class={clsx(line, 'rounded-l-full')} />
      <SmallRouteIcon class={`text-xl w-12 flex-none mx-1`}>
        {props.children}
      </SmallRouteIcon>
      <span class={clsx(line, 'rounded-r-full')} />
    </div>
  );
}
