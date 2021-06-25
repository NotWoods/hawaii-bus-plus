import clsx, { ClassValue } from 'clsx';
import { h } from 'preact';
import { CloseIcon } from '../../assets/icons/MenuIcon';
import { IconButton } from '../Button/IconButton';

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
      <CloseIcon />
    </IconButton>
  );
}
