import React, {
  AnchorHTMLAttributes,
  DetailedHTMLProps,
  useContext,
} from 'react';
import { linkAction } from './action';
import { LinkContext } from './context';

interface LinkProps
  extends DetailedHTMLProps<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  action?: unknown;
}

/**
 * Dispatches `linkAction` when clicked.
 */
export function Link({ action, ...props }: LinkProps) {
  const dispatch = useContext(LinkContext);
  return (
    <a
      {...props}
      onClick={(evt) => {
        evt.preventDefault();
        props.onClick?.(evt);
        dispatch(action || linkAction(evt.currentTarget.href));
      }}
    />
  );
}
