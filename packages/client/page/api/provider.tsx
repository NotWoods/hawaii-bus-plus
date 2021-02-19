import { useAuth0 } from '@auth0/auth0-react';
import { PromiseWorker } from '@hawaii-bus-plus/promise-worker';
import { ComponentChildren, h } from 'preact';
import { useState } from 'preact/hooks';
import InitDBWorker from '../../worker-init-db/init-db?worker';
import { usePromise } from '../hooks/usePromise';
import { ApiReadyContext } from './context';

const initWorker = new PromiseWorker(new InitDBWorker());

export function ApiReadyProvider(props: { children: ComponentChildren }) {
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [apiKey, setApiKey] = useState<string | undefined>();
  const { getAccessTokenSilently } = useAuth0();

  usePromise(async () => {
    const token = await getAccessTokenSilently({
      scope: 'read:api',
    });
    setApiKey(token);

    try {
      await initWorker.postMessage(token);
      setInitialized(true);
      initWorker.terminate();
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ApiReadyContext.Provider value={{ loading, initialized, apiKey }}>
      {props.children}
    </ApiReadyContext.Provider>
  );
}
