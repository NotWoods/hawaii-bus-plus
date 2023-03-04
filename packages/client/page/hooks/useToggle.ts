import { useMemo, useState } from 'preact/hooks';

/**
 * Stores a boolean state and provides methods to toggle it.
 */
export function useToggle(defaultState = false) {
  const [state, setState] = useState(defaultState);

  const callbacks = useMemo(
    () => ({
      toggle: () => setState((state) => !state),
      setTrue: () => setState(true),
      setFalse: () => setState(false),
    }),
    [],
  );

  return [state, callbacks] as const;
}
