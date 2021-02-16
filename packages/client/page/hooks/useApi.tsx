import { downloadScheduleData } from '@hawaii-bus-plus/data';
import { StationInformation, Stop } from '@hawaii-bus-plus/types';
import { ComponentChildren, createContext, h } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { usePromise } from '../hooks/usePromise';

interface Api {
  stops: readonly Stop[];
  bikeStations: { [id: string]: StationInformation };
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
    const { api } = await downloadScheduleData({
      apiKey: localStorage.getItem('api-key')!,
      signal,
    });
    setApi({
      stops: Object.values(api.stops),
      bikeStations: api.bike_stations,
    });
  }, []);

  return (
    <ApiContext.Provider value={api}>{props.children}</ApiContext.Provider>
  );
}

export function useApi() {
  return useContext(ApiContext);
}
