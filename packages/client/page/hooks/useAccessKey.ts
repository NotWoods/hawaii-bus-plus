import { useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

/**
 * Set up a hotkey that focuses on the referenced element.
 */
export function useAccessKey<T extends HTMLElement>(
  keys: string,
  deps?: any[]
) {
  const inputRef = useRef<T>(null);

  useHotkeys(keys, () => inputRef.current?.focus(), { keyup: true }, deps);

  return inputRef;
}
