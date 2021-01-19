import React, { createContext, ReactNode, useContext, useState } from 'react';
import { downloadScheduleData } from '../../data/fetch';
import { GTFSData } from '../../shared/gtfs-types';
import { usePromise } from '../hooks/usePromise';

const ApiContext = createContext<GTFSData | undefined>(undefined);

export function ApiProvider(props: { children: ReactNode }) {
  const [api, setApi] = useState<GTFSData | undefined>();

  usePromise((signal) => downloadScheduleData(signal).then(setApi), []);

  return (
    <ApiContext.Provider value={api}>{props.children}</ApiContext.Provider>
  );
}

export function useApi() {
  return useContext(ApiContext);
}
