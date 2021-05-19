import { useState, useEffect } from 'preact/hooks';

/**
 * Returns a boolean that is only true after a certain delay.
 * @param ms How many milliseconds to wait.
 */
export function useDelay(ms: number, deps?: unknown[]) {
  const [delayDone, setDone] = useState(false);

  useEffect(() => {
    setDone(false);
    const id = setTimeout(() => setDone(true), ms);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return delayDone;
}
