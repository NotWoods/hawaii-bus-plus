import { useEffect, useState } from 'react';

export function useMap<T>(
  map: google.maps.Map | null | undefined,
  effect: (
    setInstance: (instance: T) => void,
    map: google.maps.Map
  ) => () => void
) {
  const [instance, setInstance] = useState<T | undefined>();
  useEffect(() => {
    if (!map) return undefined;
    const onUnmount = effect(setInstance, map);

    return () => {
      onUnmount();
      setInstance(undefined);
    };
  }, [map]);
  return instance;
}

export function useListener<T extends google.maps.MVCObject>(
  target: T | undefined,
  eventName: string,
  handler: ((this: T, ...args: any[]) => void) | undefined
) {
  useEffect(() => {
    if (target && handler) {
      const listener = google.maps.event.addListener(
        target,
        eventName,
        handler
      );
      return () => listener.remove();
    } else {
      return undefined;
    }
  }, [target, handler]);
}
