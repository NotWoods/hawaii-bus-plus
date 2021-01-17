import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { downloadScheduleData } from '../../data/fetch';
import { GTFSData } from '../../shared/gtfs-types';

const ApiContext = createContext<GTFSData | undefined>(undefined);

export function ApiProvider(props: { children: ReactNode }) {
  const [api, setApi] = useState<GTFSData | undefined>();

  useEffect(() => {
    const { abort, signal } = new AbortController();
    downloadScheduleData(signal).then(setApi);
    return () => abort();
  }, []);

  return (
    <ApiContext.Provider value={api}>{props.children}</ApiContext.Provider>
  );
}

export function useApi() {
  return useContext(ApiContext);
}
