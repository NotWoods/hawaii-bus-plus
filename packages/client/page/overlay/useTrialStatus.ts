import { useState } from 'preact/hooks';
import { FEATURE_BILLING } from '../../services/env';
import { usePromise } from '../hooks';

interface PaymentResponse {
  can_pay: boolean;
  status: string;
  end: number | undefined;
}

const trialStatus = (async (): Promise<PaymentResponse> => {
  if (import.meta.env.SSR) {
    return {
      can_pay: true,
      status: 'unknown',
      end: undefined,
    };
  } else if (FEATURE_BILLING) {
    const res = await fetch('/.netlify/functions/payment', {
      credentials: 'same-origin',
    });
    const json = await res.json();
    return json as PaymentResponse;
  } else {
    return {
      can_pay: true,
      status: 'active',
      end: undefined,
    };
  }
})();

export function useTrialStatus() {
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

  return { visible, trialEnd };
}
