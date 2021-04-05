import { useEffect, useState } from 'preact/hooks';

export function useMap<T>(
  map: google.maps.Map | null | undefined,
  effect: (
    map: google.maps.Map,
  ) => {
    instance: T;
    onUnmount(instance: T, map: google.maps.Map): void;
  },
) {
  const [instance, setInstance] = useState<T | undefined>(undefined);
  useEffect(() => {
    if (!map) return undefined;
    const { instance, onUnmount } = effect(map);
    setInstance(instance);

    return () => {
      onUnmount(instance, map);
      setInstance(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);
  return instance;
}

export function useListener<T extends google.maps.MVCObject>(
  target: T | null | undefined,
  eventName: string,
  handler: ((this: T, ...args: any[]) => void) | undefined,
) {
  useEffect(() => {
    if (target && handler) {
      const listener = google.maps.event.addListener(
        target,
        eventName,
        handler,
      );
      return () => listener.remove();
    } else {
      return undefined;
    }
  }, [target, eventName, handler]);
}

export function useSetter<T>(
  obj: T | undefined,
  value: unknown,
  effect: (obj: T) => void,
) {
  useEffect(() => {
    if (obj != undefined) {
      effect(obj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obj, value]);
}
