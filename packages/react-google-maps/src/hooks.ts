import { Loader, LoaderOptions } from '@googlemaps/js-api-loader';
import { useEffect, useMemo, useState } from 'preact/hooks';

export function useJsApiLoader(
  options: LoaderOptions
): { isLoaded: boolean; loadError?: Error } {
  const [isLoaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | undefined>(undefined);

  const loader = useMemo(() => new Loader(options), [options]);

  useEffect(() => {
    if (!isLoaded) {
      loader.load().then(() => setLoaded(true), setLoadError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loader]);

  return { isLoaded, loadError };
}
