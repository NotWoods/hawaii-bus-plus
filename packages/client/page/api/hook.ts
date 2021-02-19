import { useContext } from 'preact/hooks';
import { ApiReadyContext } from './context';

/**
 * Returns a string once the database has been set up.
 */
export function useApiKey() {
  const { apiKey, initialized } = useContext(ApiReadyContext);
  return initialized ? apiKey : undefined;
}
