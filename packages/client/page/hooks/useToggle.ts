import { useCallback, useState } from 'preact/hooks';

export function useToggle(defaultState = false): [boolean, () => void] {
  const [state, setState] = useState(defaultState);

  const toggle = useCallback(() => setState((s) => !s), []);

  return [state, toggle];
}
