import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { Button } from '../../../buttons/Button';
import swapIcon from '../../../icons/swap_horiz.svg';
import { swapDirectionAction } from '../../reducer/action';
import { RouteDetailContext } from '../../reducer/context';

interface Props {
  class?: string;
}

export function SwitchDirectionButton(props: Props) {
  const { directionIds, dispatch } = useContext(RouteDetailContext);

  if (directionIds.size >= 2) {
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
