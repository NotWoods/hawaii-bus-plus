import { CloseIcon } from '../../assets/icons/MenuIcon';
import { IconButton } from './IconButton';

interface Props {
  class?: string;
  onClick?(event: MouseEvent): void;
  className?: string;
}

export function CloseButton(props: Props) {
  return (
    <IconButton
      class={props.class}
      onClick={props.onClick}
      style={{ gridArea: 'close' }}
    >
      <CloseIcon />
    </IconButton>
  );
}
