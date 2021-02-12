import { h } from 'preact';
import { BaseIcon } from './Icon';

export function MenuIcon() {
  return (
    <BaseIcon>
      <title>Menu</title>
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
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
