import { ComponentChildren, h } from 'preact';
import { classNames } from '../../hooks/classnames';
import { CloseButton } from './CloseButton';

export interface AlertProps {
  children?: ComponentChildren;
  title?: string;
  alertType?: `alert-${string & unknown}`;
  fillType?: string;
  hasDismissButton?: boolean;
  state?: string;
  onClose?(): void;
}

export function Alert(props: AlertProps) {
  const {
    title,
    alertType,
    fillType = '',
    state = '',
    hasDismissButton = true,
  } = props;
  return (
    <div className={classNames(`alert`, alertType, fillType, state)}>
      {title ? <h4 className="alert-heading">{title}</h4> : null}
      {hasDismissButton && <CloseButton onClick={props.onClose} />}
      {props.children}
    </div>
  );
}
