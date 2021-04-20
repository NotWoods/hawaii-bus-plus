import { h } from 'preact';
import { SidebarItem } from './SidebarItem';

export function Sidebar() {
  return (
    <nav class="waves overlay fixed shadow z-10 py-4 w-full md:w-96 h-screen overflow-y-auto">
      <h1 class="font-display font-medium text-2xl px-4">Settings</h1>
      <ul class="px-4 mt-4">
        <SidebarItem href="#account">Account</SidebarItem>
        <SidebarItem href="#display">Accessibility and display</SidebarItem>
        <SidebarItem href="#about">Additional resources</SidebarItem>
        <SidebarItem href="/.netlify/functions/logout">Logout</SidebarItem>
      </ul>
    </nav>
  );
}
