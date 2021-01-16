import React from 'react';

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
    hasDismissButton = false,
  } = props;
  return (
    <div className={`alert ${alertType} ${fillType} ${state}`}>
      {title ? <h4 className="alert-heading">{title}</h4> : null}
      {hasDismissButton ? (
        <button
          className="close"
          data-dismiss="alert"
          type="button"
          aria-label="Close"
          onClick={props.onClose}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      ) : null}
      {props.children}
    </div>
  );
}
