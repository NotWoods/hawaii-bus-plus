import { h } from 'preact';
import { IconButton } from '../../buttons/IconButton';
import { IconTw } from '../../icons/Icon';
import clearIcon from '../../icons/clear.svg';

interface Props {
  dark?: boolean;
  className?: string;
  onClick?(): void;
}

export function CloseButton(props: Props) {
  return (
    <IconButton
      class="w-12 h-12 p-3"
      dark={props.dark}
      aria-label="Close"
      onClick={props.onClick}
    >
      <IconTw
        src={clearIcon}
        alt="Clear"
        class={props.dark ? 'filter-invert' : undefined}
      />
    </IconButton>
  );
}
