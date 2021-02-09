import { h } from 'preact';
import { Button } from '../../../buttons/Button';
import swapIcon from '../../../icons/swap_horiz.svg';

interface Props {
  switchDirection?(): void;
}

export function SwitchDirectionButton(props: Props) {
  return (
    <Button icon={swapIcon} onClick={props.switchDirection}>
      Switch direction
    </Button>
  );
}
