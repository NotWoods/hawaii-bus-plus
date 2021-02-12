import { Loader, LoaderOptions } from '@googlemaps/js-api-loader';
import { createContext } from 'preact';
import { useContext, useEffect, useMemo, useState } from 'preact/hooks';

export const MapContext = createContext<google.maps.Map | null>(null);

/**
 * Variant of the react-google-map function that doesn't throw if map is null.
 */
export function useGoogleMap() {
  return useContext(MapContext);
}

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
