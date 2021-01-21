import React, { createContext, ReactNode, useContext, useState } from 'react';
import { downloadScheduleData } from '@hawaii-bus-plus/data';
import { GTFSData, Route } from '@hawaii-bus-plus/types';
import { usePromise } from '../hooks/usePromise';

interface Api extends Omit<GTFSData, 'routes'> {
  routes: { [route_id: string]: Route };
}

const ApiContext = createContext<Api | undefined>(undefined);

export function ApiProvider(props: { children: ReactNode }) {
  const [api, setApi] = useState<Api | undefined>();

  usePromise((signal) => downloadScheduleData(signal).then(setApi), []);

  return (
    <ApiContext.Provider value={api}>{props.children}</ApiContext.Provider>
  );
}

export function useApi() {
  return useContext(ApiContext);
}
