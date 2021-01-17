/**
 * Simple version of the classnames package.
 */
export function classNames(...classes: (string | null | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}
