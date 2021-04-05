import clsx, { ClassValue } from 'clsx';
import { h } from 'preact';
import clearIcon from '../icons/clear.svg';
import { Icon } from '../icons/Icon';
import { IconButton } from './IconButton';

interface Props {
  class?: string;
  onClick?(): void;
  className?: ClassValue;
}

export function CloseButton(props: Props) {
  return (
    <IconButton
      class={clsx('w-12 h-12 p-3', props.class)}
      onClick={props.onClick}
      style={{ gridArea: 'close' }}
    >
      <Icon src={clearIcon} alt="Close" class="filter dark:invert" />
    </IconButton>
  );
}
