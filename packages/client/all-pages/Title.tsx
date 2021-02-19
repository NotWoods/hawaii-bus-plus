import { h } from 'preact';

interface Props {
  class?: string;
}

export function Title(props: Props) {
  return (
    <h1
      class={`font-display font-medium text-2xl uppercase flex items-center ${
        props.class ?? ''
      }`}
    >
      <img
        class="h-8 mr-1"
        src="/logo/logo_hawaii.svg"
        alt="Hawaii"
        width="101"
        height="32"
      />
      Bus Plus
      <img
        class="h-4 ml-1 mb-3"
        src="/logo/logo_plus.svg"
        alt="+"
        width="18"
        height="16"
      />
    </h1>
  );
}
