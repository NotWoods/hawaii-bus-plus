import { h } from 'preact';
import { classNames } from '../../hooks/classnames';
import './CloseButton.css';

interface Props {
  className?: string;
  onClick?(): void;
}

export function CloseButton(props: Props) {
  return (
    <button
      className={classNames('close', props.className)}
      data-dismiss="alert"
      type="button"
      aria-label="Close"
      onClick={props.onClick}
    >
      <span aria-hidden="true">&times;</span>
    </button>
  );
}
