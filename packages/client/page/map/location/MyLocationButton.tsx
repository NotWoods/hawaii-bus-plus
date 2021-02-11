import { useGoogleMap } from '@hawaii-bus-plus/react-google-maps';
import { h } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { FloatingActionButton } from '../../buttons/FloatingActionButton';
import { classNames } from '../../hooks/classnames';
import locationIcon from '../../icons/gps_fixed.svg';
import { Icon } from '../../icons/Icon';
import { MyLocationContext } from './context';

interface Props {
  shiftUp?: boolean;
}

export function MyLocationButton(props: Props) {
  const map = useGoogleMap();
  const { coords, onButtonClick } = useContext(MyLocationContext);
  const [shouldCenter, setShouldCenter] = useState(false);

  function handleClick() {
    onButtonClick();
    setShouldCenter(true);
  }

  useEffect(() => {
    if (shouldCenter && map && coords) {
      map.panTo(coords);
      setShouldCenter(false);
    }
  }, [shouldCenter, map, coords]);

  return (
    <FloatingActionButton
      mini
      title="My location"
      onClick={handleClick}
      class={classNames(
        'fixed m-4 right-0 md:right-auto md:left-80',
        props.shiftUp ? 'bottom-1/4-screen' : 'bottom-0'
      )}
    >
      <Icon src={locationIcon} alt="My location" class="filter-invert" />
    </FloatingActionButton>
  );
}
