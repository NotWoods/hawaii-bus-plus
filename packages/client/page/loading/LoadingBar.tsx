import { h } from 'preact';
import './LoadingBar.css';

/**
 * Indeterminate progress bar
 */
export function LoadingBar() {
  return (
    <div class="loading__linear overflow-hidden m-4 bg-primary-100 relative h-1">
      <progress class="sr-only">Loading</progress>
    </div>
  );
}
