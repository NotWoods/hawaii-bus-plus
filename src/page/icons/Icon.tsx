import React from 'react';
import './Icon.css';

interface Props {
  src: string;
  alt: string;
}

export function Icon(props: Props) {
  return (
    <img
      className="icon"
      src={props.src}
      alt={props.alt}
      width="24"
      height="24"
    />
  );
}
