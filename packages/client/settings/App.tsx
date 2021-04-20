import { Fragment, h } from 'preact';
import { Settings } from './components/content/Settings';
import { Sidebar } from './components/sidebar/Sidebar';

export function App() {
  return (
    <>
      <Sidebar />
      <Settings />
    </>
  );
}
