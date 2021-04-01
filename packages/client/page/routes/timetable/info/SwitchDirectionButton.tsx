import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { Button } from '../../../buttons/Button';
import swapIcon from '../../../icons/swap_horiz.svg';
import { RouteDetailContext } from '../context';

interface Props {
  class?: string;
}

function swapDirection(currentDirection: 0 | 1) {
  if (currentDirection === 0) {
    return 1;
  } else {
    return 0;
  }
}

export function SwitchDirectionButton(props: Props) {
  const { directionIds, setDirectionId } = useContext(RouteDetailContext);

  if (directionIds.size >= 2) {
    return (
      <Button
        class={props.class}
        iconClass="dark:filter-invert"
        icon={swapIcon}
        onClick={() => setDirectionId(swapDirection)}
      >
        Switch direction
      </Button>
    );
  } else {
    return null;
  }
}
