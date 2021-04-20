import { ComponentChildren, h } from 'preact';
import { Icon } from '../../../page/icons/Icon';
// import arrowIcon from '../../../page/icons/arrow_right.svg';
import openInNewIcon from '../../../page/icons/open_in_new.svg';

interface Props {
  href: string;
  children: ComponentChildren;
}

export function SidebarItem(props: Props) {
  return (
    <li>
      <a
        class="flex p-2 mb-1 transition bg-blue-50 hover:bg-blue-100 dark:bg-blue-600 dark:hover:bg-blue-500 text-gray-800 dark:text-white shadow hover:shadow-lg"
        href={props.href}
      >
        {props.children}
        {props.href.startsWith('#') ? null : (
          <Icon class="ml-auto filter dark:invert" src={openInNewIcon} alt="" />
        )}
      </a>
    </li>
  );
}
