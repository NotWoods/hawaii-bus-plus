import { h } from 'preact';
import type { JSXInternal as JSX } from 'preact/src/jsx';

type Props =
  | JSX.HTMLAttributes<HTMLButtonElement>
  | JSX.HTMLAttributes<HTMLAnchorElement>;

function isAnchor(
  props: Props
): props is JSX.HTMLAttributes<HTMLAnchorElement> {
  return props.href != undefined;
}

export function ButtonOrAnchor(props: Props) {
  if (isAnchor(props)) {
    return <a {...props} />;
  } else {
    return <button type="button" {...props} />;
  }
}
