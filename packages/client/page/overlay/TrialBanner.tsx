import { ComponentChildren, Fragment, h } from 'preact';
import { RelativeDurationElement } from '../time/DurationElement';
import { useTrialStatus } from './useTrialStatus';

const SECONDS_IN_DAY = 1000 * 60 * 60 * 24;

export function TrialBanner() {
  const { visible, trialEnd } = useTrialStatus();

  if (visible) {
    let endString: ComponentChildren = 'soon';

    if (trialEnd) {
      const days = Math.floor((trialEnd - Date.now()) / SECONDS_IN_DAY);
      if (days > 0) {
        endString = (
          <>
            on{' '}
            <RelativeDurationElement duration={{ days, string: `P${days}D` }} />
          </>
        );
      } else {
        endString = 'today';
      }
    }

    return (
      <aside class="bg-primary-900 p-2">
        <a href="/.netlify/functions/billing" class="hover:underline">
          Your trial ends {endString}. Update billing to keep using the app.
        </a>
      </aside>
    );
  } else {
    return null;
  }
}
