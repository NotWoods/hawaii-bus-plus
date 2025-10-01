import type { ComponentChildren, InputHTMLAttributes } from 'preact';
import clsx from 'clsx';

interface Props
  extends Pick<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'autocomplete' | 'readonly' | 'value'
  > {
  /**
   * Text to display above the input.
   */
  children: ComponentChildren;
  /**
   * ID for the input. Must be unique.
   */
  id: string;
  /**
   * Theme to use for the input.
   */
  theme: 'light' | 'dark' | 'auto';

  name: string;
  type: 'text' | 'email' | 'password';
}

export function InputField({ children, theme, ...props }: Props) {
  return (
    <div>
      <label class="flex justify-between" for={props.id}>
        {children}
      </label>
      <input
        {...props}
        required
        tabIndex={props.readonly ? -1 : 0}
        class={clsx('input mt-1 shadow-xs block w-full focus:ring-cyan', {
          'opacity-60': props.readonly,
          'text-black': theme === 'light' || theme === 'auto',
          'bg-primary-700 text-white': theme === 'dark',
          'dark:bg-primary-700 dark:text-white': theme === 'auto',
        })}
      />
    </div>
  );
}
