import { h, ComponentChildren } from 'preact';

interface Props {
  children?: ComponentChildren;
}

export function PointHeader({ children }: Props) {
  return (
    <h2 class="font-display font-medium text-xl mx-4">
      {children ?? 'Loading'}
    </h2>
  );
}

export function PointDescription({ children }: Props) {
  return <p class="opacity-80 mx-4">{children}</p>;
}

export function PointRoutes() {
  return null;
}
