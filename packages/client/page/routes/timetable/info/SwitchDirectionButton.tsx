import { h } from 'preact';
import { Button } from '../../../buttons/Button';
import swapIcon from '../../../icons/swap_horiz.svg';

interface Props {
  class?: string;
  switchDirection?(): void;
}

export function SwitchDirectionButton(props: Props) {
  return (
    <Button
      class={props.class}
      iconClass="dark:filter-invert"
      icon={swapIcon}
      onClick={props.switchDirection}
    >
      Switch direction
    </Button>
  );
}
