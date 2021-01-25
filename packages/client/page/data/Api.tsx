import { downloadScheduleData } from '@hawaii-bus-plus/data';
import { GTFSData } from '@hawaii-bus-plus/types';
import { pick } from '@hawaii-bus-plus/utils';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { usePromise } from '../hooks/usePromise';

interface Api extends Pick<GTFSData, 'routes' | 'stops'> {}

const ApiContext = createContext<Api | undefined>(undefined);

export function ApiProvider(props: { children: ReactNode }) {
  const [api, setApi] = useState<Api | undefined>();

  usePromise(
    (signal) =>
      downloadScheduleData(signal).then((api) =>
        setApi(pick(api, ['routes', 'stops']))
      ),
    []
  );

  return (
    <ApiContext.Provider value={api}>{props.children}</ApiContext.Provider>
  );
}

export function useApi() {
  return useContext(ApiContext);
}
