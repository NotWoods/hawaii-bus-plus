import React, { ReactNode } from 'react';

export function NavbarContainer(props: { children: ReactNode }) {
  return <nav className="navbar">{props.children}</nav>;
}

export function SidebarContainer(props: { children: ReactNode }) {
  return <aside className="sidebar">{props.children}</aside>;
}
