import clsx from 'clsx';
import type { ComponentChildren } from 'preact';
import { OutlinedButton } from '../../components/Button/OutlinedButton';
import { CloseButton } from '../../components/Button/CloseButton';

export interface SnackbarProps {
  children?: ComponentChildren;
  action?: ComponentChildren;
  class?: string;
  onClose?(): void;
  onAction?(): void;
}

export function Snackbar(props: SnackbarProps) {
  return (
    <div
      className={clsx(
        'mx-auto pl-4 py-2 flex gap-2 items-center shadow-sm max-w-sm bg-red text-white motion-safe:transition',
        props.class,
      )}
    >
      <span class="mr-auto">{props.children}</span>
      {props.action && (
        <OutlinedButton onClick={props.onAction}>{props.action}</OutlinedButton>
      )}
      <CloseButton class="self-start" onClick={props.onClose} />
    </div>
  );
}
