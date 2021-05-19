import { h } from 'preact';
import { useMemo } from 'preact/hooks';

interface Props {
  /** An hour of the day, ranging between 0 and 23 inclusive. */
  hour?: number;
}

/**
 * Displays a different greeting depending on time of day.
 */
export function Greeting(props: Props) {
  const hour = useMemo(() => {
    if (props.hour != undefined) return props.hour;

    return new Date().getHours();
  }, [props.hour]);

  let greeting: string;
  if (hour < 11) {
    // Good morning
    greeting = 'Aloha kakahiaka';
  } else if (hour < 18) {
    // Good mid-day
    greeting = 'Aloha awakea';
  } else {
    // Good evening
    greeting = 'Aloha ahiahi';
  }

  return (
    <p class="mt-4 font-display font-medium text-xl text-center text-white">
      {greeting}
    </p>
  );
}
