import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { GTFSData } from '../../shared/gtfs-types';

const ApiContext = createContext<GTFSData | undefined>(undefined);

function getScheduleData(signal: AbortSignal): Promise<GTFSData> {
  return fetch('/api.json', { signal })
    .then((res) => {
      if (res.ok) return res.json();
      throw new Error(res.statusText);
    })
    .then((json) => json as GTFSData);
}

export function ApiProvider(props: { children: ReactNode }) {
  const [api, setApi] = useState<GTFSData | undefined>();

  useEffect(() => {
    const { abort, signal } = new AbortController();
    getScheduleData(signal).then(setApi);
    return () => abort();
  }, []);

  return (
    <ApiContext.Provider value={api}>{props.children}</ApiContext.Provider>
  );
}

export function useApi() {
  return useContext(ApiContext);
}
