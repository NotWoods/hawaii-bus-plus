import React from 'react';
import { useAccessKey } from './hooks/useAccessKey';

export function Sidebar() {
  const inputRef = useAccessKey<HTMLInputElement>('shift+f');

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <input
          type="text"
          className="form-control"
          placeholder="Search"
          accessKey="f"
          ref={inputRef}
        />
        <div className="mt-10 font-size-12">
          Press <kbd>shift</kbd> + <kbd>F</kbd> to focus
        </div>
      </div>
    </aside>
  );
}
