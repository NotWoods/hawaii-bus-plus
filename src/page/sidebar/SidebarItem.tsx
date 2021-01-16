import React from 'react';
import './SidebarItem.css';

export interface Props {
  href?: string;
  icon?: string;
  iconAlt?: string;
  iconBackgroundType?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
}

export function SidebarItem(props: Props) {
  return (
    <a
      href={props.href}
      className="sidebar-link sidebar-link-with-icon sidebar-link-multiline"
    >
      <span className={`sidebar-icon ${props.iconBackgroundType}`}>
        <img className="icon" src={props.icon} alt={props.iconAlt} />
      </span>
      <p className="sidebar-link-title">{props.title}</p>
      <p className="sidebar-link-subtitle">{props.subtitle}</p>
    </a>
  );
}
