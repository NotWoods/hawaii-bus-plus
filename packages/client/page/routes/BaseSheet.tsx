import { ComponentChildren, h } from 'preact';
import { classNames } from '../hooks/classnames';
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
    <div
      class={classNames('relative md:ml-80', loadError ? '' : 'top-3/4-screen')}
    >
      <article
        class={classNames(
          'animate-enter--sheet shadow-lg bg-gray-50 dark:bg-gray-800 text-black dark:text-white lg:mx-4',
          loadError ? '' : 'min-h-1/4-screen',
          props.loaded ? 'animate-run' : 'animate-pause'
        )}
        style={props.style}
      >
        {props.children}
      </article>
    </div>
  );
}
