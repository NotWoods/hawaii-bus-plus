import { swap_horiz } from '../../../../../assets/icons/paths';
import { OutlinedButton } from '../../../../../components/Button/OutlinedButton';
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
      <OutlinedButton
        class={props.class}
        iconClass="dark:invert"
        icon={swap_horiz}
        onClick={() => dispatch(swapDirectionAction())}
      >
        Switch direction
      </OutlinedButton>
    );
  } else {
    return null;
  }
}
