import React from 'react';
import { classNames } from '../hooks/classnames';
import { RouterAction } from '../router/action';
import { Link } from '../router/Router';
import './SidebarItem.css';

export interface SidebarItemProps {
  href?: string;
  icon: React.ReactNode;
  iconColor?: string;
  iconDark?: boolean;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
  iconClasses?: string;
  action?: RouterAction;
  onClick?(): void;
}

export function SidebarItem(props: SidebarItemProps) {
  return (
    <Link
      action={props.action}
      href={props.href}
      className={classNames(
        'sidebar-link sidebar-link-with-icon sidebar-link-multiline',
        props.className
      )}
      onClick={props.onClick}
    >
      <span
        className={classNames(
          'sidebar-icon',
          props.iconClasses,
          props.iconDark !== undefined &&
            (props.iconDark ? 'text-dark' : 'text-white')
        )}
        style={{ backgroundColor: props.iconColor }}
      >
        {props.icon}
      </span>
      <p className="sidebar-link-title m-0">{props.title}</p>
      <p className="sidebar-link-subtitle m-0 font-size-12">{props.subtitle}</p>
    </Link>
  );
}
