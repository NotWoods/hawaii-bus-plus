import { h } from 'preact';
import { IconButton } from '../../buttons/IconButton';
import { IconTw } from '../../icons/Icon';
import clearIcon from '../../icons/clear.svg';
import { classNames } from '../../hooks/classnames';

interface Props {
  class?: string;
  dark?: boolean;
  onClick?(): void;

  className?: string;
}

export function CloseButton(props: Props) {
  return (
    <IconButton
      class={classNames('w-12 h-12 p-3', props.class)}
      dark={props.dark}
      aria-label="Close"
      onClick={props.onClick}
      style={{ gridArea: 'close' }}
    >
      <IconTw
        src={clearIcon}
        alt="Close"
        class={props.dark ? 'dark:filter-invert' : undefined}
      />
    </IconButton>
  );
}
