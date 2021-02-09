import { ComponentChildren, h } from 'preact';
import { IconButton } from '../buttons/IconButton';
import { MenuIcon } from '../icons/MenuIcon';

interface Props {
  children: ComponentChildren;
}

export function SearchBase(props: Props) {
  return (
    <section class="bg-center bg-no-repeat py-4 bg-gray-800 md:w-80 md:h-screen">
      <IconButton class="w-12 h-12 p-3 text-white" dark>
        <MenuIcon />
      </IconButton>
      {props.children}
    </section>
  );
}
