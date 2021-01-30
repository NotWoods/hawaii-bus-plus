import React from 'react';
import { classNames } from '../../hooks/classnames';
import { CloseButton } from './CloseButton';

export interface AlertProps {
  children?: React.ReactNode;
  title?: string;
  alertType?: string;
  fillType?: string;
  hasDismissButton?: boolean;
  state?: string;
  onClose?(): void;
}

export function Alert(props: AlertProps) {
  const {
    title,
    alertType = '',
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
