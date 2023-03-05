import clsx from 'clsx';
import type { ComponentChildren } from 'preact';

interface Props<T> {
  forceTitles: boolean;
  list: readonly T[];
  title: ComponentChildren;
  titleClass?: string;
  child(item: T): ComponentChildren;
}

export function SearchResultsSubList<T>(props: Props<T>) {
  const { forceTitles = true, list } = props;
  const showTitle = forceTitles || list.length > 0;
  return (
    <>
      {showTitle ? (
        <h4
          class={clsx('font-display text-xl text-white mx-4', props.titleClass)}
        >
          {props.title}
        </h4>
      ) : null}
      <ul class={clsx('mx-4', { 'my-2': showTitle })}>
        {list.map(props.child)}
      </ul>
    </>
  );
}
