import { h, Fragment } from 'preact';

export interface Props {
  children: React.ReactNode;
}

export function SidebarTitle(props: Props) {
  return (
    <>
      <h5 className="sidebar-title">{props.children}</h5>
      <div className="sidebar-divider" />
    </>
  );
}
