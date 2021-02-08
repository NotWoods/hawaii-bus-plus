import { ComponentChildren, h } from 'preact';

interface Props {
  children: ComponentChildren;
  title?: string;
  style?: {
    [key: string]: string | number | null | undefined;
  };
}

export function RouteIcon(props: Props) {
  const ring = 'ring-1 ring-gray-500 bg-route';
  const line = `${ring} block w-8 h-2`;
  return (
    <div class="flex items-center" {...props}>
      <span class={`${line} rounded-l-full`} />
      <span
        class={`${ring} text-xl flex-none w-12 mx-1 font-display font-medium text-center text-route`}
      >
        {props.children}
      </span>
      <span class={`${line} rounded-r-full`} />
    </div>
  );
}
