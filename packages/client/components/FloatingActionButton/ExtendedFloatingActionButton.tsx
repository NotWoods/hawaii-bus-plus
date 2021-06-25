import { h } from 'preact';
import { BaseIcon } from '../../assets/icons/Icon';

export function ExtendedFloatingActionButton() {
  return (
    <a
      href="#top"
      class="fixed m-4 p-2 bottom-0 right-0 flex text-white focus:ring-cyan bg-primary-500 hover:bg-primary-600 motion-safe:transition-colors shadow-lg"
    >
      <BaseIcon class="mr-1">
        <path d="M8 11h3v10h2V11h3l-4-4-4 4zM4 3v2h16V3H4z" />
      </BaseIcon>
      Scroll to top
    </a>
  );
}
