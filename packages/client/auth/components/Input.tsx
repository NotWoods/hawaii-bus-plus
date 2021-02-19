import { ComponentChildren, h } from 'preact';

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
      <input {...props} required class="mt-1 shadow-sm block w-full" />
    </div>
  );
}
