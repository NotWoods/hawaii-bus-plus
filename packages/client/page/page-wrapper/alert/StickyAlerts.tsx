import { ComponentChildren, createContext, h } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { Alert, AlertProps } from './Alert';
import { makeId } from './make';

type AlertData = Omit<AlertProps, 'state' | 'onClose'>;

interface Context {
  alerts: ReadonlyMap<AlertData, string>;
  keys: WeakMap<AlertData, string>;
  toastAlert(alert: AlertData, timeShown?: number): void;
  dismissAlert(alert: AlertData): void;
}

const StickyAlertsContext = createContext<Context>({
  alerts: new Map(),
  keys: new WeakMap(),
  toastAlert() {},
  dismissAlert() {},
});

/**
 * Top level provider for sticky alerts
 */
export function StickyAlertsProvider(props: { children: ComponentChildren }) {
  const [alerts, setAlerts] = useState(new Map<AlertData, string>());
  const [keys, setKeys] = useState(new WeakMap<AlertData, string>());

  function dismissAlert(alert: AlertData) {
    const update = new Map(alerts);
    update.delete(alert);
    setAlerts(update);
  }

  function toastAlert(alert: AlertData, timeShown = 5000) {
    let state = 'alert-block';
    setAlerts(new Map(alerts).set(alert, state));
    setKeys(keys.set(alert, makeId(6)));

    // Show the alert
    // The 0.25 seconds delay is for the animation
    setTimeout(() => {
      state += ' show';
      setAlerts(new Map(alerts).set(alert, state));
    }, 250);

    // Wait some time (timeShown + 250) and fade out the alert
    const timeToFade = timeShown + 250;
    setTimeout(() => {
      state += ' fade';
      setAlerts(new Map(alerts).set(alert, state));
    }, timeToFade);

    // Wait some more time (timeToFade + 500) and dispose the alert (by removing the .alert-block class)
    // Again, the extra delay is for the animation
    // Remove the .show and .fade classes (so the alert can be toasted again)
    const timeToDestroy = timeToFade + 500;
    setTimeout(() => {
      dismissAlert(alert);
    }, timeToDestroy);
  }

  return (
    <StickyAlertsContext.Provider
      value={{ alerts, keys, toastAlert, dismissAlert }}
    >
      {props.children}
    </StickyAlertsContext.Provider>
  );
}

/**
 * Element that displays sticky alerts
 */
export function StickyAlertsList() {
  const { alerts, keys, dismissAlert } = useContext(StickyAlertsContext);

  return (
    <div className="sticky-alerts">
      {Array.from(alerts).map(([alert, state]) => (
        <Alert
          {...alert}
          state={state}
          key={keys.get(alert)}
          onClose={() => dismissAlert(alert)}
        />
      ))}
    </div>
  );
}

export function useAlerts() {
  const { toastAlert } = useContext(StickyAlertsContext);
  return toastAlert;
}
