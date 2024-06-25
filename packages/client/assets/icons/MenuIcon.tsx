import { BaseIcon } from './Icon';

export function UpIcon() {
  return (
    <BaseIcon>
      <title>Up</title>
      <path
        key="path"
        d="M9.02 7.62 4.5 11.88l4.53 3.8v5.34a195 195 0 0 0-4.96-4.8l-.4-.36a89.25 89.25 0 0 0-1.24-1.1c-.75-.59-1.22-.88-1.4-.88v-4h.01c.05 0 .14-.05.3-.13l.13-.07.13-.07a5.45 5.45 0 0 0 .83-.66l1.94-1.93L6.8 4.55l.08-.08 2.15-2.19v5.34Zm0 2.73h8.7a30.84 30.84 0 0 0 4.4-.25 2.82 2.82 0 0 0 .95-.28 7.95 7.95 0 0 0-.97 2.24c-.06.3-.1.57-.1.84v.06H10.43l-1.4.01v-2.62Z"
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

export function CloseIcon() {
  return (
    <BaseIcon>
      <title>Close</title>
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
    </BaseIcon>
  );
}
