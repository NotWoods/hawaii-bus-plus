import { useGoogleMap } from '@hawaii-bus-plus/react-google-maps';
import clsx from 'clsx';

import { memo } from 'preact/compat';
import { useCallback, useContext, useEffect, useState } from 'preact/hooks';
import { BaseIcon } from '../../../assets/icons/Icon';
import { FloatingActionButton } from '../../../components/Button/FloatingActionButton';
import { useLoadGoogleMaps } from '../../hooks/useLoadGoogleMaps';
import { MyLocationContext } from './context';

export interface Props {
  shiftUp?: boolean;
  mode: 'searching' | 'disabled' | 'found';
  handleClick?(): void;
}

export const MyLocationButtonContent = memo((props: Props) => {
  const { mode } = props;
  const title = 'My location';

  return (
    <FloatingActionButton
      mini
      title={title}
      onClick={props.handleClick}
      class={clsx(
        'fixed m-6 right-0 md:right-auto md:left-80',
        props.shiftUp ? 'bottom-[25vh]' : 'bottom-0',
      )}
    >
      <BaseIcon class="relative">
        <title>{title}</title>
        <ellipse
          class={clsx(
            'motion-safe:transition-opacity',
            mode === 'found' ? 'opacity-100' : 'opacity-0',
          )}
          cx="12"
          cy="12"
          rx="3"
          ry="2.62"
        />
        <path d="M3.03 12.76c-.64.02-1.15.05-1.55.1a7.77 7.77 0 0 0-1.08.19c.14-.15.26-.38.39-.7l.02-.04a2.84 2.84 0 0 0 .2-1.06h2A8.94 8.94 0 0 1 3.9 7.7a6.1 6.1 0 0 1 2.8-2.73c.57-.29 1.18-.5 1.81-.65a12.2 12.2 0 0 1 2.5-.3V2.6c0-.34-.15-.61-.33-.61h2.66c-.18 0-.33.27-.33.61V4.01c1.77.05 3.22.36 4.37.94a6 6 0 0 1 2.75 2.74c.33.68.57 1.4.7 2.15.08.45.14.92.16 1.4.83 0 1.45-.03 1.86-.1l.23-.03a1.55 1.55 0 0 0 .53-.16l-.15.24a4.6 4.6 0 0 0-.4 1.05c-.03.16-.05.32-.05.48v.03h-2.02c-.1 1.6-.5 2.95-1.18 4.06a6.6 6.6 0 0 1-.82 1.06c-1.06 1.11-2.61 1.79-4.67 2.03-.43.05-.87.08-1.31.1V21.38c0 .34.15.61.33.61h-2.66c.18 0 .33-.28.33-.61V19.99a15.5 15.5 0 0 1-1.72-.16 9.43 9.43 0 0 1-2.21-.6 5.96 5.96 0 0 1-2.03-1.36 7.84 7.84 0 0 1-2.01-5.1Zm8.89 5.15h.3c.44 0 .89-.02 1.33-.07a6.68 6.68 0 0 0 1.94-.5 3.74 3.74 0 0 0 1.88-1.83l.02-.04c.3-.61.49-1.38.57-2.3.04-.42.06-.83.06-1.25 0-.96-.1-1.78-.28-2.48-.08-.34-.2-.67-.36-.99a3.77 3.77 0 0 0-1.92-1.83 7.4 7.4 0 0 0-2.5-.53c-.24-.02-.5-.03-.75-.03h-.29c-.47 0-.94.03-1.4.08a7 7 0 0 0-1.91.5c-.88.37-1.54.99-1.97 1.85-.18.36-.32.74-.42 1.14-.09.37-.15.77-.2 1.21a11.83 11.83 0 0 0 .26 3.68c.09.32.2.64.36.94.43.87 1.1 1.5 1.98 1.88.41.17.84.3 1.29.39a9.61 9.61 0 0 0 2.01.18Z" />
        <path
          class={clsx(
            'fill-current text-primary-500 motion-safe:transition-opacity',
            mode === 'disabled' ? 'opacity-100' : 'opacity-0',
          )}
          d="M21 21h-6L3 3h6l12 18Z"
        />
        <path
          class={clsx(
            'motion-safe:transition-opacity',
            mode === 'disabled' ? 'opacity-100' : 'opacity-0',
          )}
          d="M17.1 21 5.1 3h1.8l12 18h-1.8Z"
        />
      </BaseIcon>
    </FloatingActionButton>
  );
});

export function MyLocationButton(props: { shiftUp?: boolean }) {
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

  const handleClick = useCallback(() => {
    onButtonClick();
    setShouldCenter(true);
  }, [onButtonClick]);

  if (loadError) return null;

  let mode: Props['mode'];
  if (coords) {
    mode = 'found';
  } else if (error) {
    mode = 'disabled';
  } else {
    mode = 'searching';
  }

  return (
    <MyLocationButtonContent
      shiftUp={props.shiftUp}
      mode={mode}
      handleClick={handleClick}
    />
  );
}
