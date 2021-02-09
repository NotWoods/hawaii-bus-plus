import { h } from 'preact';
import type { JSXInternal as JSX } from 'preact/src/jsx';

type Props = Omit<JSX.HTMLAttributes<HTMLProgressElement>, 'value'>;

/**
 * Indeterminate progress bar
 */
export function LoadingBar(props: Props) {
  return <progress {...props}>Loading</progress>;
}
