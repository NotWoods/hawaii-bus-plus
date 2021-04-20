import { ComponentChildren, h } from 'preact';

interface Props {
  id: string;
  children: ComponentChildren;
}

export function Header(props: Props) {
  return (
    <h2 class="text-3xl font-display font-medium pt-3" id={props.id}>
      {props.children}
    </h2>
  );
}
