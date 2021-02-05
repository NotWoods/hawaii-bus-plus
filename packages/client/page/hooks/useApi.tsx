import { downloadScheduleData } from '@hawaii-bus-plus/data';
import { Route, Stop, Agency } from '@hawaii-bus-plus/types';
import { ComponentChildren, createContext, h } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { usePromise } from '../hooks/usePromise';

interface Api {
  routes: readonly Route[];
  stops: readonly Stop[];
  agency: { [id: string]: Agency };
}

declare module 'preact/hooks' {
  export function useState<S>(
    initialState: S | (() => S)
  ): [S, StateUpdater<S>];
  export function useState<S = undefined>(): [
    S | undefined,
    StateUpdater<S | undefined>
  ];
}

const ApiContext = createContext<Api | undefined>(undefined);

export function ApiProvider(props: { children: ComponentChildren }) {
  const [api, setApi] = useState<Api | undefined>();

  usePromise(async (signal) => {
    const api = await downloadScheduleData(
      localStorage.getItem('api-key')!,
      signal
    );
    setApi({
      routes: Object.values(api.routes),
      stops: Object.values(api.stops),
      agency: api.agency,
    });
  }, []);

  return (
    <ApiContext.Provider value={api}>{props.children}</ApiContext.Provider>
  );
}

export function useApi() {
  return useContext(ApiContext);
}
