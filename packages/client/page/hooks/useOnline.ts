import { useState, useEffect, useRef } from 'preact/hooks';

const noop = () => {};

function useWindowListener(eventName: string, callback: () => void) {
  const savedHandler = useRef<() => void>(noop);

  useEffect(() => {
    savedHandler.current = callback;
  }, [callback]);

  useEffect(() => {
    function listener() {
      savedHandler.current();
    }

    window.addEventListener(eventName, listener);
    return () => window.removeEventListener(eventName, listener);
  }, [eventName]);
}

const ssr = import.meta.env.SSR;

/**
 * @returns True if the user is currently connected to the internet
 */
export function useOnline() {
  const [online, setOnline] = useState(() => !ssr && navigator.onLine);
  useWindowListener('online', () => setOnline(true));
  useWindowListener('offline', () => setOnline(false));
  return online;
}
