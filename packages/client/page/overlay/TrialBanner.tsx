import { ComponentChildren, Fragment, h } from 'preact';
import { useState } from 'preact/hooks';
import { usePromise } from '../hooks';
import { RelativeDurationElement } from '../time/DurationElement';

interface PaymentResponse {
  can_pay: boolean;
  status: string;
  end: number | undefined;
}

const SECONDS_IN_DAY = 1000 * 60 * 60 * 24;

const trialStatus = (async (): Promise<PaymentResponse> => {
  if (import.meta.env.SSR) {
    return {
      can_pay: true,
      status: 'unknown',
      end: undefined,
    };
  } else {
    const res = await fetch('/.netlify/functions/payment', {
      credentials: 'same-origin',
    });
    const json = await res.json();
    return json as PaymentResponse;
  }
})();

export function TrialBanner() {
  const [visible, setVisible] = useState(false);
  const [trialEnd, setTrialEnd] = useState<number | undefined>();

  usePromise(async () => {
    try {
      const { status, can_pay, end } = await trialStatus;

      if (status === 'trialing' && !can_pay) {
        if (end != undefined) {
          setTrialEnd(end);
        }
        setVisible(true);
      }
    } catch {
      setVisible(false);
    }
  }, []);

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
