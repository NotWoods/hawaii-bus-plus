import { downloadScheduleData } from '@hawaii-bus-plus/data';
import { Route, Stop } from '@hawaii-bus-plus/types';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { usePromise } from '../hooks/usePromise';

interface Api {
  routes: readonly Route[];
  stops: readonly Stop[];
}

const ApiContext = createContext<Api | undefined>(undefined);

export function ApiProvider(props: { children: ReactNode }) {
  const [api, setApi] = useState<Api | undefined>();

  usePromise(async (signal) => {
    const api = await downloadScheduleData(
      localStorage.getItem('api-key')!,
      signal
    );
    setApi({
      routes: Object.values(api.routes),
      stops: Object.values(api.stops),
    });
  }, []);

  return (
    <ApiContext.Provider value={api}>{props.children}</ApiContext.Provider>
  );
}

export function useApi() {
  return useContext(ApiContext);
}
