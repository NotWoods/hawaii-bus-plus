import { createContext } from 'preact';

interface ApiReadyContext {
  apiKey?: string;
  loading: boolean;
  initialized: boolean;
}

export const ApiReadyContext = createContext<ApiReadyContext>({
  loading: true,
  initialized: false,
});
