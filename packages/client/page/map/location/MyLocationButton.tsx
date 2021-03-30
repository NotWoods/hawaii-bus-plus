import { useGoogleMap } from '@hawaii-bus-plus/react-google-maps';
import clsx from 'clsx';
import { h } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { FloatingActionButton } from '../../buttons/FloatingActionButton';
import { useLoadGoogleMaps } from '../../hooks/useLoadGoogleMaps';
import { BaseIcon } from '../../icons/Icon';
import { MyLocationContext } from './context';

interface Props {
  shiftUp?: boolean;
}

export function MyLocationButton(props: Props) {
  const map = useGoogleMap();
  const { loadError } = useLoadGoogleMaps();
  const { coords, error, onButtonClick } = useContext(MyLocationContext);
  const [shouldCenter, setShouldCenter] = useState(false);

  useEffect(() => {
    if (shouldCenter && map && coords) {
      map.panTo(coords);
      setShouldCenter(false);
    }
  }, [shouldCenter, map, coords]);

  if (loadError) return null;

  function handleClick() {
    onButtonClick();
    setShouldCenter(true);
  }

  const title = 'My location';

  return (
    <FloatingActionButton
      mini
      title={title}
      onClick={handleClick}
      class={clsx(
        'fixed m-6 right-0 md:right-auto md:left-80',
        props.shiftUp ? 'bottom-[25vh]' : 'bottom-0'
      )}
    >
      <BaseIcon class="relative">
        <title>{title}</title>
        <path d="M21 11a9 9 0 00-8-8V1h-2v2a9 9 0 00-8 8H1v2h2a9 9 0 008 8v2h2v-2a9 9 0 008-8h2v-2h-2zm-9 8a7 7 0 110-14 7 7 0 010 14z" />
        <circle
          class={clsx(
            'transition-opacity',
            coords ? 'opacity-100' : 'opacity-0'
          )}
          cx="12"
          cy="12"
          r="4"
        />
        <path
          class={clsx(
            'transition-opacity',
            error ? 'opacity-100' : 'opacity-0'
          )}
          d="M19.7 21L3 4.3l1.4-1.4 16.7 16.7-1.4 1.4z"
        />
        <path
          class={clsx(
            'fill-blue-500 transition-opacity',
            error ? 'opacity-100' : 'opacity-0'
          )}
          d="M21.3 19.7L4.6 3 6 1.6l16.7 16.7-1.4 1.4z"
        />
      </BaseIcon>
    </FloatingActionButton>
  );
}
