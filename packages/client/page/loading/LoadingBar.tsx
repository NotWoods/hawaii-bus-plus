import './LoadingBar.css';

/**
 * Indeterminate progress bar
 */
export function LoadingBar() {
  return (
    <progress class="loading__linear block absolute h-1">Loading</progress>
  );
}
