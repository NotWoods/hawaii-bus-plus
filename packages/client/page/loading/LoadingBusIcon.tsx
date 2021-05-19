import { h } from 'preact';
import './LoadingBusIcon.css';

export function LoadingBusIcon() {
  return <div class="text-center mx-8 mt-4">
    <svg class="max-w-xs stroke-current inline-block" viewBox="0 0 137 31" fill="none">
      <g class="loadbus__bus">
        <path d="M42 26H29.7a.6.6 0 01-.5-.3l-3.1-5.5-.1-.3.5-8h4.8s0 0 0 0a.6.6 0 00.5-.3l2.4-4a.6.6 0 00-.6-.8h-6l3.2-5.2a.6.6 0 01.4-.3h0s0 0 0 0H134a.6.6 0 01.6.6l-.1.3-3 6.7 4.5 8.4M57 26h47m15 0h14a.6.6 0 00.6-.4l2.4-7.9s0 0 0 0m0 0a.6.6 0 01-.6.5h-4.7a.6.6 0 01-.6-.6V9a.6.6 0 01.5-.6.6.6 0 01.6.3l4.7 8.6m0 .4h0c.1-.1.1-.2 0-.2v-.2M26 15.5h35m7 0h52M37.4 6.8H58a.6.6 0 01.5.9l-2.3 3.9a.6.6 0 01-.5.3H35.2a.6.6 0 01-.5-.9L37 7a.6.6 0 01.4-.2zm35.3 0s0 0 0 0h20.4a.6.6 0 01.6.9l-2.4 3.9a.6.6 0 01-.5.3H70.4a.6.6 0 01-.5-.9l2.4-4a.6.6 0 01.4-.2zm24.2 0h20.5a.6.6 0 01.5.3.6.6 0 010 .6l-2.3 3.9a.6.6 0 01-.5.3H94.7a.6.6 0 01-.5-.9l2.4-4a.6.6 0 01.3-.2z" />
        <rect width="5.8" height="15.8" x="61.6" y="4.6" rx="1.4" stroke-width="1.3" />
        <rect width="5.8" height="15.8" x="120.6" y="4.6" rx="1.4" stroke-width="1.3" />
      </g>
      <g stroke-width="1.3">
        <path class="loadbus__line" d="M22.5 14.5h-20" />
        <path class="loadbus__line" d="M20.5 21.5H.5" />
        <path class="loadbus__line" d="M25.5 7.5h-19" />
      </g>
      <g stroke-width="1.3">
        <circle cx="49.5" cy="24.5" r="5.9" />
        <circle cx="111.5" cy="24.5" r="5.9" />
      </g>
    </svg>
    <p class="mt-2">Loading...</p>
  </div>
}
