import { ComponentChildren, h } from 'preact';
import { classNames } from '../../hooks/classnames';

const ring = 'ring-1 ring-gray-500 bg-route';
const line = `${ring} block w-8 h-2`;

interface SmallIconProps {
  children: ComponentChildren;
  class?: string;
  title?: string;
  style?: {
    [key: string]: string | number | null | undefined;
  };
}

export function SmallRouteIcon(props: SmallIconProps) {
  return (
    <span
      {...props}
      class={classNames(
        ring,
        'font-display font-medium text-center text-route px-1',
        props.class
      )}
    />
  );
}

interface IconProps {
  children: ComponentChildren;
  title?: string;
  style?: {
    [key: string]: string | number | null | undefined;
  };
}

export function RouteIcon(props: IconProps) {
  return (
    <div class="flex items-center" {...props}>
      <span class={`${line} rounded-l-full`} />
      <SmallRouteIcon class={`text-xl w-12 flex-none mx-1`}>
        {props.children}
      </SmallRouteIcon>
      <span class={`${line} rounded-r-full`} />
    </div>
  );
}
