import { h } from 'preact';
import { classNames } from '../hooks/classnames';
import clearIcon from '../icons/clear.svg';
import { Icon } from '../icons/Icon';
import { IconButton } from './IconButton';

interface Props {
  class?: string;
  onClick?(): void;

  className?: string;
}

export function CloseButton(props: Props) {
  return (
    <IconButton
      class={classNames('w-12 h-12 p-3', props.class)}
      onClick={props.onClick}
      style={{ gridArea: 'close' }}
    >
      <Icon src={clearIcon} alt="Close" class="dark:filter-invert" />
    </IconButton>
  );
}
