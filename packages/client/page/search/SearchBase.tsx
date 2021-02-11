import { ComponentChildren, h } from 'preact';
import { IconButton } from '../buttons/IconButton';
import { classNames } from '../hooks/classnames';
import { useLoadGoogleMaps } from '../hooks/useLoadGoogleMaps';
import { UpIcon } from '../icons/MenuIcon';

interface Props {
  children: ComponentChildren;
  icon?: ComponentChildren;
  iconDisabled?: boolean;
  showIcon?: boolean;
  title?: ComponentChildren;
  logo?: ComponentChildren;
  onClose?(): void;
}

export function SearchBase(props: Props) {
  const { loadError } = useLoadGoogleMaps();
  return (
    <section
      class={classNames(
        'overlay fixed flex flex-col bg-center bg-no-repeat shadow z-10 py-4 bg-blue-700 w-full md:w-80 max-h-screen md:h-screen text-white overflow-y-auto',
        loadError && 'h-screen'
      )}
    >
      <header class="flex items-center">
        <IconButton
          class="w-12 h-12 p-3 text-white"
          forceDark
          disabled={props.iconDisabled}
          onClick={props.onClose}
        >
          {props.icon ?? <UpIcon />}
        </IconButton>
        {props.logo ? (
          props.logo
        ) : props.title ? (
          <h2 class="font-display font-medium text-2xl">{props.title}</h2>
        ) : null}
      </header>
      {props.children}
    </section>
  );
}
