import { useLazyComponent } from '../hooks';
import { DIRECTIONS_PATH, type MainState } from '../router/state';
import { RouteTimetable } from './routes/RouteTimetable';

export function MainSheet({ main }: { main?: MainState }) {
  const { ConnectedJourneySheet } = useLazyComponent(
    () => import('./directions/JourneySheet'),
  );

  if (ConnectedJourneySheet && main?.path === DIRECTIONS_PATH) {
    return <ConnectedJourneySheet timeZone="Pacific/Honolulu" />;
  } else {
    return <RouteTimetable />;
  }
}
