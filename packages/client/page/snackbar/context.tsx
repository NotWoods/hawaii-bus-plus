import { createContext, type ComponentChildren } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { type SnackbarProps } from './Snackbar';

type SnackbarData = Omit<SnackbarProps, 'class' | 'onClose'>;

interface Context {
  snackbars: ReadonlyMap<SnackbarData, string>;
  showSnackbar(alert: SnackbarData, timeShown?: number): void;
  dismissSnackbar(alert: SnackbarData): void;
}

export const StickySnackbarContext = createContext<Context>({
  snackbars: new Map(),
  showSnackbar() {},
  dismissSnackbar() {},
});

/**
 * Top level provider for sticky alerts
 */
export function StickySnackbarProvider(props: { children: ComponentChildren }) {
  const [snackbars, setSnackbars] = useState<Context['snackbars']>(new Map());

  function dismissSnackbar(alert: SnackbarData) {
    const update = new Map(snackbars);
    update.delete(alert);
    setSnackbars(update);
  }

  function showSnackbar(alert: SnackbarData, timeShown = 5000) {
    let state = 'opacity-0 scale-0';
    setSnackbars(new Map(snackbars).set(alert, state));

    // Show the alert
    // The 0.25 seconds delay is for the animation
    setTimeout(() => {
      state = 'opacity-1 scale-100';
      setSnackbars(new Map(snackbars).set(alert, state));
    }, 250);

    // Wait some time (timeShown + 250) and fade out the alert
    const timeToFade = timeShown + 250;
    setTimeout(() => {
      state = 'opacity-0';
      setSnackbars(new Map(snackbars).set(alert, state));
    }, timeToFade);

    // Wait some more time (timeToFade + 500) and dispose the alert (by removing the .alert-block class)
    // Again, the extra delay is for the animation
    // Remove the .show and .fade classes (so the alert can be toasted again)
    const timeToDestroy = timeToFade + 500;
    setTimeout(() => {
      dismissSnackbar(alert);
    }, timeToDestroy);
  }

  return (
    <StickySnackbarContext.Provider
      value={{
        snackbars,
        showSnackbar,
        dismissSnackbar,
      }}
    >
      {props.children}
    </StickySnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const { showSnackbar } = useContext(StickySnackbarContext);
  return showSnackbar;
}
