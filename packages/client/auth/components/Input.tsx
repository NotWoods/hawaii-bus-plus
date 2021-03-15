import { ComponentChildren, h } from 'preact';
import '../../all-pages/Input.css';

interface Props {
  children: ComponentChildren;
  id: string;
  name: string;
  type: 'text' | 'email' | 'password';
  autocomplete?: string;
  readonly?: boolean;
  value?: string;
}

export function Input({ children, ...props }: Props) {
  return (
    <div>
      <label class="flex justify-between" for={props.id}>
        {children}
      </label>
      <input
        {...props}
        required
        tabIndex={props.readonly ? -1 : 0}
        class={`input mt-1 shadow-sm block w-full text-black ${
          props.readonly ? 'opacity-60' : ''
        }`}
      />
    </div>
  );
}
