import { ComponentChildren, h } from 'preact';
import './BaseSheet.css';

interface Props {
  children: ComponentChildren;
  style?: {
    [key: string]: string | number | null | undefined;
  };
}

export function BaseSheet(props: Props) {
  return (
    <div class="sheet__container relative md:ml-80">
      <article
        class="sheet shadow-lg bg-gray-50 dark:bg-gray-800 dark:text-white lg:mx-4"
        style={props.style}
      >
        {props.children}
      </article>
    </div>
  );
}
