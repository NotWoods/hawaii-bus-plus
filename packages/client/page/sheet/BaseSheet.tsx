import clsx from 'clsx';
import type { ComponentChildren } from 'preact';
import { useLoadGoogleMaps } from '../hooks/useLoadGoogleMaps';

interface Props {
  children: ComponentChildren;
  style?: {
    [key: string]: string | number | null | undefined;
  };
  loaded?: boolean;
}

export function BaseSheet(props: Props) {
  const { loadError } = useLoadGoogleMaps();
  return (
    <div class={clsx('relative z-10 md:ml-80', { 'top-[75vh]': !loadError })}>
      <article
        class={clsx(
          'animate-enter motion-reduce:animate-duration-0 shadow-lg bg-gradient-to-br from-zinc-100 to-primary-50 dark:from-zinc-750 dark:to-zinc-800 text-black dark:text-white lg:mx-4',
          { 'min-h-[25vh]': !loadError },
          props.loaded ? 'animate-run' : 'animate-pause',
        )}
        style={props.style}
      >
        {props.children}
      </article>
    </div>
  );
}
