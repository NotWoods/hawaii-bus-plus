import clsx from 'clsx';
import { ComponentChildren, h } from 'preact';
import { useEffect } from 'preact/hooks';
import { IconButton } from '../buttons/IconButton';
import { useLoadGoogleMaps } from '../hooks/useLoadGoogleMaps';
import { UpIcon } from '../icons/MenuIcon';

interface Props {
  children: ComponentChildren;
  icon?: ComponentChildren;
  title?: ComponentChildren;
  logo?: ComponentChildren;
  onButtonClick?(): void;
}

export function BaseOverlay(props: Props) {
  const { loadError } = useLoadGoogleMaps();

  useEffect(() => {
    console.log('GMaps load error:', loadError);
  }, [loadError]);

  return (
    <section
      class={clsx(
        'waves overlay fixed flex flex-col shadow z-10 py-4 w-full top-0 md:w-80 max-h-screen md:h-screen overflow-y-auto',
        { 'h-screen': loadError != undefined },
      )}
    >
      <header class="flex items-center">
        <IconButton
          id="appBarUp"
          class="w-12 h-12 p-3 text-white"
          forceDark
          accessKey="s"
          disabled={props.icon === false}
          onClick={props.onButtonClick}
        >
          {props.icon ?? <UpIcon />}
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
