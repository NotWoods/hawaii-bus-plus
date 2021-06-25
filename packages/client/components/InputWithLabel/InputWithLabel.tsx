import { ComponentChildren, h } from 'preact';
import clsx from 'clsx';

interface Props {
  children: ComponentChildren;
  id: string;
  name: string;
  type: 'text' | 'email' | 'password';
  theme: 'light' | 'dark' | 'auto';
  autocomplete?: string;
  readonly?: boolean;
  value?: string;
}

export function InputWithLabel({ children, theme, ...props }: Props) {
  return (
    <div>
      <label class="flex justify-between" for={props.id}>
        {children}
      </label>
      <input
        {...props}
        required
        tabIndex={props.readonly ? -1 : 0}
        class={clsx('input mt-1 shadow-sm block w-full focus:ring-cyan', {
          'opacity-60': props.readonly,
          'text-black': theme === 'light' || theme === 'auto',
          'bg-primary-700 text-white': theme === 'dark',
          'dark:bg-primary-700 dark:text-white': theme === 'auto',
        })}
      />
    </div>
  );
}
