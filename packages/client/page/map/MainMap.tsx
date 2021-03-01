import { h } from 'preact';
import { useLazyComponent } from '../hooks/useLazyComponent';
import { useLoadGoogleMaps } from '../hooks/useLoadGoogleMaps';

const lazyMap = import('./MapContent');

export function MainMap() {
  const { isLoaded } = useLoadGoogleMaps();
  const { MapContent } = useLazyComponent(() => lazyMap);

  return (
    <section class="fixed sheet inset-0 md:top-0 md:ml-80">
      {isLoaded && MapContent ? <MapContent /> : undefined}
    </section>
  );
}
