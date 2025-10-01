import clsx from 'clsx';
import type { ComponentChildren } from 'preact';
import { useEffect } from 'preact/hooks';
import { UpIcon } from '../../assets/icons/MenuIcon';
import { IconButton } from '../../components/Button/IconButton';
import { useLoadGoogleMaps } from '../hooks/useLoadGoogleMaps';

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
   * Will replace the title and navigation button if both are provided.
   */
  logo?: ComponentChildren;
  /**
   * Click handler for the navigation button.
   */
  onNavigate?: () => void;
}

export function BaseOverlay({ children, title, logo, onNavigate }: Props) {
  const { loadError } = useLoadGoogleMaps();

  useEffect(() => {
    if (loadError) {
      console.log('GMaps load error:', loadError);
    }
  }, [loadError]);

  return (
    <section
      class={clsx(
        'waves overlay fixed flex flex-col shadow-sm z-10 pb-4 w-full top-0 md:w-80 max-h-screen md:h-screen overflow-y-auto scheme-dark',
        { 'h-screen': loadError != undefined },
      )}
    >
      <header
        class={clsx(
          'flex items-center pt-4 min-h-16',
          logo ? 'justify-center' : '',
        )}
      >
        {logo ?? (
          <>
            <IconButton
              id="appBarUp"
              onClick={onNavigate}
              forceDark
              accessKey="s"
              title="Up"
            >
              <UpIcon />
            </IconButton>
            {title ? (
              <h2 class="font-display font-medium text-2xl">{title}</h2>
            ) : null}
          </>
        )}
      </header>
      {children}
    </section>
  );
}
