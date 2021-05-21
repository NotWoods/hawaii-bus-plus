import clsx from 'clsx';
import { h } from 'preact';
import './DecorLines.css';

export function TripDecorDot() {
  return (
    <div class="grid-area-dot bg-transparent rounded-full ring-route ring-4 w-2 h-2 flex-none" />
  );
}

interface Props {
  gridArea: string;
  rounded?: boolean;
  horizontal?: 'md';
}

export function TripDecorLine({ gridArea, rounded, horizontal }: Props) {
  return (
    <div
      class={clsx('bg-route w-2 h-full', {
        'md:w-full md:h-2': horizontal === 'md',
        'rounded-b-full': rounded,
        'md:rounded-r-full': horizontal === 'md' && rounded,
      })}
      style={{ gridArea }}
    />
  );
}
