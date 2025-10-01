import styles from './LoadingBar.module.css';

/**
 * Indeterminate progress bar
 */
export function LoadingBar() {
  return (
    <progress class={`${styles['loading__linear']} block absolute h-1`}>
      Loading
    </progress>
  );
}
