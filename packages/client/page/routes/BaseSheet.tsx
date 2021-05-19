import clsx from 'clsx';
import { ComponentChildren, h } from 'preact';
import { useLoadGoogleMaps } from '../hooks/useLoadGoogleMaps';
import './BaseSheet.css';

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
          'animate-enter--sheet shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 to:gray-100 dark:from-gray-750 dark:to-gray-800 text-black dark:text-white lg:mx-4',
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
