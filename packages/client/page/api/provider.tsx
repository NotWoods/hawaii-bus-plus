import { PromiseWorker } from '@hawaii-bus-plus/promise-worker';
import { ComponentChildren, h } from 'preact';
import { useState } from 'preact/hooks';
import InitDBWorker from '../../worker-init-db/init-db?worker';
import { usePromise } from '../hooks/usePromise';
import { ApiReadyContext } from './context';

const initWorker = new PromiseWorker(new InitDBWorker());
const dbInitialized = initWorker
  .postMessage('')
  .then(() => initWorker.terminate());

export function ApiReadyProvider(props: { children: ComponentChildren }) {
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  usePromise(async () => {
    try {
      await dbInitialized;
      setInitialized(true);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ApiReadyContext.Provider value={{ loading, initialized, apiKey: '' }}>
      {props.children}
    </ApiReadyContext.Provider>
  );
}
