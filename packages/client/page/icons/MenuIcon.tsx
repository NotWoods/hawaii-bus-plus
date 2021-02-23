import { h } from 'preact';
import { BaseIcon } from './Icon';

export function MenuIcon(props: { open?: boolean }) {
  return (
    <BaseIcon>
      <title>Menu</title>
      {props.open ? (
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
      ) : (
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
      )}
    </BaseIcon>
  );
}

export function UpIcon() {
  return (
    <BaseIcon>
      <title>Up</title>
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
    </BaseIcon>
  );
}
