import { useContext } from 'preact/hooks';
import { StickySnackbarContext } from './context';
import { Snackbar } from './Snackbar';

function CurrentSnackbar() {
  const { snackbars, dismissSnackbar } = useContext(StickySnackbarContext);
  if (snackbars.size > 0) {
    const [[snackbar, state]] = snackbars;
    return (
      <Snackbar
        {...snackbar}
        class={state}
        onClose={() => dismissSnackbar(snackbar)}
      />
    );
  } else {
    return null;
  }
}

/**
 * Element that displays sticky snackbars
 */
export function StickySnackbars() {
  return (
    <div className="fixed z-50 bottom-20 md:bottom-0 left-0 md:left-80 right-0 m-4">
      <CurrentSnackbar />
    </div>
  );
}
