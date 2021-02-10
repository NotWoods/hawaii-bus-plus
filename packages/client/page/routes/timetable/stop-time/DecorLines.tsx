import { h } from 'preact';
import { classNames } from '../../../hooks/classnames';
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
      class={classNames(
        'bg-route w-2 h-full',
        horizontal === 'md' && 'md:w-full md:h-2',
        rounded && 'rounded-b-full',
        horizontal === 'md' && rounded && 'md:rounded-r-full'
      )}
      style={{ gridArea }}
    />
  );
}
