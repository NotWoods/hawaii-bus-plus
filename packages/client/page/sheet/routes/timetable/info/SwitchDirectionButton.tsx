import { h } from 'preact';
import { swap_horiz } from '../../../../../assets/icons/paths';
import { Button } from '../../../../buttons/Button';
import { swapDirectionAction } from '../../../../router/action/routes';
import { useDispatch, useSelector } from '../../../../router/hooks';
import { selectHasMultipleDirections } from '../../../../router/selector/main';

interface Props {
  class?: string;
}

export function SwitchDirectionButton(props: Props) {
  const canSwap = useSelector(selectHasMultipleDirections);
  const dispatch = useDispatch();

  if (canSwap) {
    return (
      <Button
        class={props.class}
        iconClass="dark:invert"
        icon={swap_horiz}
        onClick={() => dispatch(swapDirectionAction())}
      >
        Switch direction
      </Button>
    );
  } else {
    return null;
  }
}
