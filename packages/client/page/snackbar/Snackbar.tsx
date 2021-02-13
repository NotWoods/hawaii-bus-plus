import { ComponentChildren, h } from 'preact';
import { Button } from '../buttons/Button';
import { CloseButton } from '../buttons/CloseButton';
import { classNames } from '../hooks/classnames';

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
      className={classNames(
        'mx-auto pl-4 flex gap-2 items-center shadow w-96 bg-gray-900 transition',
        props.class
      )}
    >
      <span class="mr-auto">{props.children}</span>
      {props.action && <Button onClick={props.onAction}>{props.action}</Button>}
      <CloseButton onClick={props.onClose} />
    </div>
  );
}
