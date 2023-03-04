import clsx from 'clsx';
import type { ComponentChildren, JSX } from 'preact';
import { useEffect } from 'preact/hooks';
import type { Merge } from 'type-fest';
import { UpIcon } from '../../assets/icons/MenuIcon';
import { IconButton } from '../../components/Button/IconButton';
import { useLoadGoogleMaps } from '../hooks/useLoadGoogleMaps';
import { TrialBanner } from './TrialBanner';

interface Props {
  /**
   * Content displayed below the app bar.
   */
  children: ComponentChildren;
  /**
   * Slot for the title in the app bar.
   * Shown inside a styled heading element.
   */
  title?: ComponentChildren;
  /**
   * Slot for the logo in the app bar.
   * Will replace the title if both are provided.
   */
  logo?: ComponentChildren;
  /**
   * Slot for the navigation button in the app bar.
   */
  navigation?: Merge<
    JSX.HTMLAttributes<HTMLButtonElement>,
    {
      icon?: ComponentChildren;
    }
  >;
  /**
   * Click handler for the navigation button.
   */
  onNavigate?: () => void;
}

export function BaseOverlay(props: Props) {
  const { loadError } = useLoadGoogleMaps();

  useEffect(() => {
    console.log('GMaps load error:', loadError);
  }, [loadError]);

  const { icon, ...navigationSlot } = props.navigation ?? {};

  return (
    <section
      class={clsx(
        'waves overlay fixed flex flex-col shadow z-10 pb-4 w-full top-0 md:w-80 max-h-screen md:h-screen overflow-y-auto color-scheme-dark',
        { 'h-screen': loadError != undefined },
      )}
    >
      <TrialBanner />
      <header class="flex items-center pt-4">
        <IconButton
          id="appBarUp"
          class="w-12 h-12 p-3"
          onClick={props.onNavigate}
          {...navigationSlot}
          forceDark
          accessKey="s"
          disabled={icon === false}
        >
          {icon ?? <UpIcon />}
        </IconButton>
        {props.logo ? (
          props.logo
        ) : props.title ? (
          <h2 class="font-display font-medium text-2xl">{props.title}</h2>
        ) : null}
      </header>
      {props.children}
    </section>
  );
}
