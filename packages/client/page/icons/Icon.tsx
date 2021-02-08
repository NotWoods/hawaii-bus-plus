import { h } from 'preact';
import { classNames } from '../hooks/classnames';
import './Icon.css';

interface Props {
  src: string;
  alt: string;
  className?: string;
  small?: boolean
}

export function Icon(props: Props) {
  return (
    <img
      className={classNames('icon inline-block', props.small ? 'align-baseline w-6 h-6' : 'w-8 h-8', props.className)}
      src={props.src}
      alt={props.alt}
      width="24"
      height="24"
    />
  );
}
