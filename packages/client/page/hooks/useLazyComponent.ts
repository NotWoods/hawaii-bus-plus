import { useState } from 'preact/hooks';
import { usePromise } from './usePromise';

export function useLazyComponent<T>(lazy: () => Promise<T>) {
  const [component, setComponent] = useState<T | Partial<T>>({});

  usePromise(async () => {
    const component = await lazy();
    setComponent(component);
  }, []);

  return component;
}
