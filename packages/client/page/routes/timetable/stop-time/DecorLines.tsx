import { h } from 'preact';
import './DecorLines.css';

export function TripDecorDot() {
  return (
    <div class="grid-area-dot bg-white rounded-full ring-route ring-4 w-2 h-2 flex-none" />
  );
}

export function TripDecorLine(props: { gridArea: string }) {
  return (
    <div
      class="bg-route w-2 h-full md:w-full md:h-2 rounded-b-full md:rounded-r-full"
      style={props}
    />
  );
}
