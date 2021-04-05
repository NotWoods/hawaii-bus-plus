import { h } from 'preact';
import { BaseIcon } from './Icon';

export function MenuIcon(props: { open?: boolean }) {
  return (
    <BaseIcon>
      <title>Menu</title>
      {props.open ? (
        <path
          key="path"
          d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
        />
      ) : (
        <path key="path" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
      )}
    </BaseIcon>
  );
}

export function UpIcon() {
  return (
    <BaseIcon>
      <title>Up</title>
      <path
        key="path"
        d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
      />
    </BaseIcon>
  );
}

export function SearchIcon(props: { class?: string }) {
  return (
    <BaseIcon class={props.class} fillBlack>
      <title>Search</title>
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </BaseIcon>
  );
}
