import React from 'react';
import { classNames } from '../hooks/classnames';
import './Icon.css';

interface Props {
  src: string;
  alt: string;
  className?: string;
}

export function Icon(props: Props) {
  return (
    <img
      className={classNames('icon', props.className)}
      src={props.src}
      alt={props.alt}
      width="24"
      height="24"
    />
  );
}
