import { ComponentChildren, h } from 'preact';
import { useState } from 'preact/hooks';
import { useAccessKey } from '../hooks/useAccessKey';
import { SidebarContainer } from '../page-wrapper/Containers';
import { DefaultRoutes } from './DefaultRoutes';
import { SidebarSearch } from './search/SidebarSearch';
import './Sidebar.css';

interface Props {
  onDirectionsClick?(): void;
}

export function Sidebar(props: Props) {
  const inputRef = useAccessKey<HTMLInputElement>('shift+f');
  const [search, setSearch] = useState('');

  let children: ComponentChildren;
  if (search) {
    children = <SidebarSearch search={search} />;
  } else {
    children = <DefaultRoutes onDirectionsClick={props.onDirectionsClick} />;
  }

  return (
    <SidebarContainer>
      <div className="sidebar-content">
        <input
          type="search"
          className="form-control"
          placeholder="Route or location"
          aria-label="Route or location"
          accessKey="f"
          value={search}
          ref={inputRef}
          onChange={(evt) => setSearch(evt.currentTarget.value)}
        />
      </div>

      {children}
    </SidebarContainer>
  );
}
