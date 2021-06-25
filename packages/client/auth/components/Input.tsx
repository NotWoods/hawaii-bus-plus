import { ComponentChildren, h } from 'preact';
import { InputWithLabel } from '../../components/InputWithLabel/InputWithLabel';

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
  return <InputWithLabel theme="light" {...props} />;
}
