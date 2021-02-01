import { h, ComponentChildren } from 'preact';

export function NavbarContainer(props: { children: ComponentChildren }) {
  return <nav className="navbar">{props.children}</nav>;
}

export function SidebarContainer(props: { children: ComponentChildren }) {
  return <aside className="sidebar">{props.children}</aside>;
}
