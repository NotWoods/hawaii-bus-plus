import { ComponentChildren, h, Fragment } from 'preact';
import { classNames } from '../../hooks/classnames';

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
          class={classNames(
            'font-display text-xl text-white mx-4',
            props.titleClass
          )}
        >
          {props.title}
        </h4>
      ) : null}
      <ul class={classNames('mx-4', showTitle && 'my-2')}>
        {list.map(props.child)}
      </ul>
    </>
  );
}
