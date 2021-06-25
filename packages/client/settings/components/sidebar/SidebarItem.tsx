import { ComponentChildren, h } from 'preact';
import { Icon } from '../../../assets/icons/Icon';
import { open_in_new } from '../../../assets/icons/paths';

interface Props {
  href: string;
  children: ComponentChildren;
}

export function SidebarItem(props: Props) {
  return (
    <li>
      <a
        class="flex p-2 mb-1 motion-safe:transition bg-primary-50 hover:bg-primary-100 dark:bg-primary-600 dark:hover:bg-primary-500 text-gray-800 dark:text-white shadow hover:shadow-lg"
        href={props.href}
      >
        {props.children}
        {props.href.startsWith('#') ? null : (
          <Icon class="ml-auto dark:invert" src={open_in_new} alt="" />
        )}
      </a>
    </li>
  );
}
