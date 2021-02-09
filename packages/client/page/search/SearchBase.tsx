import { ComponentChildren, h } from 'preact';
import { IconButton } from '../buttons/IconButton';
import { UpIcon } from '../icons/MenuIcon';

interface Props {
  children: ComponentChildren;
  icon?: ComponentChildren;
  title?: ComponentChildren;
  onClose?(): void;
}

export function SearchBase(props: Props) {
  return (
    <section class="bg-center bg-no-repeat shadow py-4 bg-gray-800 md:w-80 md:h-screen text-white">
      <header class="flex items-center">
        <IconButton
          class="w-12 h-12 p-3 text-white"
          dark
          onClick={props.onClose}
        >
          {props.icon ?? <UpIcon />}
        </IconButton>
        {props.title ? (
          <h2 class="font-display font-medium text-2xl">{props.title}</h2>
        ) : null}
      </header>
      {props.children}
    </section>
  );
}
