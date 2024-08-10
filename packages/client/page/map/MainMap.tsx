import { lazy } from 'preact/compat';
import { useLoadGoogleMaps } from '../hooks/useLoadGoogleMaps';
import { SnackbarSuspense } from '../loading/SnackbarErrorBoundary';

const lazyMap = import('./MapContent');
const LazyMapContent = lazy(async () => (await lazyMap).MapContent);

export function MainMap() {
  const { isLoaded } = useLoadGoogleMaps();

  return (
    <section class="fixed inset-0 md:top-0 md:ml-80">
      <SnackbarSuspense fallback={null}>
        {isLoaded ? <LazyMapContent /> : undefined}
      </SnackbarSuspense>
    </section>
  );
}
