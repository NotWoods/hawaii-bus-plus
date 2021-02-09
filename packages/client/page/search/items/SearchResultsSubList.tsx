import { ComponentChildren, h, Fragment } from 'preact';

interface Props<T> {
  forceTitles: boolean;
  list: readonly T[];
  title: ComponentChildren;
  child(item: T): ComponentChildren;
}

export function SearchResultsSubList<T>(props: Props<T>) {
  const { forceTitles = true, list } = props;
  return (
    <>
      {forceTitles || list.length > 0 ? (
        <h4 class="font-display text-xl text-white mx-4">{props.title}</h4>
      ) : null}
      <ul class="px-4 py-2">{list.map(props.child)}</ul>
    </>
  );
}
