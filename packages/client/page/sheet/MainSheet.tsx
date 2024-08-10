import { lazy, Suspense } from 'preact/compat';
import { SnackbarErrorBoundary } from '../loading/SnackbarErrorBoundary';
import { DIRECTIONS_PATH, type MainState } from '../router/state';
import { RouteTimetable } from './routes/RouteTimetable';

const ConnectedJourneySheet = lazy(
  async () => (await import('./directions/JourneySheet')).ConnectedJourneySheet,
);

export function MainSheet({ main }: { main?: MainState }) {
  if (main?.path === DIRECTIONS_PATH) {
    return (
      <SnackbarErrorBoundary fallback={null}>
        <Suspense fallback={<RouteTimetable />}>
          <ConnectedJourneySheet timeZone="Pacific/Honolulu" />
        </Suspense>
      </SnackbarErrorBoundary>
    );
  } else {
    return <RouteTimetable />;
  }
}
