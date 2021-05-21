import { h } from 'preact';
import { Button } from '../../../../buttons/Button';
import swapIcon from '../../../../icons/swap_horiz.svg';
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
        iconClass="filter dark:invert"
        icon={swapIcon}
        onClick={() => dispatch(swapDirectionAction())}
      >
        Switch direction
      </Button>
    );
  } else {
    return null;
  }
}
