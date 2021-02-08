import { ComponentChildren, h } from 'preact';

interface Props {
  children: ComponentChildren;
  title?: string;
  style?: {
    [key: string]: string | number | null | undefined;
  };
}

export function RouteIcon(props: Props) {
  return (
    <div class="flex items-center" {...props}>
      <span class="block w-8 h-2 rounded-l-full bg-route" />
      <span class="text-xl flex-none w-12 mx-1 font-display font-medium text-center bg-route text-route">
        {props.children}
      </span>
      <span class="block w-8 h-2 rounded-r-full bg-route" />
    </div>
  );
}
