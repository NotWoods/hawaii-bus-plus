import type { ComponentChildren } from 'preact';
import { Icon } from '../../../assets/icons/Icon';
import { error } from '../../../assets/icons/paths';

function HomeButtons(props: {
  children?: ComponentChildren;
  icon: string;
  about: ComponentChildren;
}) {
  return (
    <div class="mx-4 mt-8">
      <p class="flex mb-4">
        <Icon
          src={props.icon}
          alt=""
          class="w-6 h-6 mt-1 mr-2 invert opacity-60"
        />
        {props.about}
      </p>
      {props.children}
    </div>
  );
}

export function BrowserUnsupported() {
  return (
    <HomeButtons
      icon={error}
      about="Bus data failed to load, try refreshing or clearing your browser cache."
    />
  );
}
