import { ComponentChildren, h } from 'preact';

interface Props {
  title: ComponentChildren;
  subtitle: ComponentChildren;
  children: ComponentChildren;
}

export function FormSection(props: Props) {
  return (
    <section class="grid">
      <header>
        <h3>{props.title}</h3>
        <p>{props.subtitle}</p>
      </header>
      <div>{props.children}</div>
    </section>
  );
}
