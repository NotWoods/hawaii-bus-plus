import type { ComponentChildren } from 'preact';
import { InputField } from '../../components/Field/InputField';

interface Props {
  children: ComponentChildren;
  id: string;
  name: string;
  type: 'text' | 'email' | 'password';
  autocomplete?: string;
  readonly?: boolean;
  value?: string;
}

export function Input(props: Props) {
  return <InputField theme="light" {...props} />;
}
