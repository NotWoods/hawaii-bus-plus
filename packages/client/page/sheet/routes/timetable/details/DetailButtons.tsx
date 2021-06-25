import { Agency, Route, Trip } from '@hawaii-bus-plus/types';
import { Fragment, h } from 'preact';
import { useCallback } from 'preact/hooks';
import { monetization_on, share } from '../../../../../assets/icons/paths';
import { OutlinedButton } from '../../../../../components/Button/OutlinedButton';
import { errorMessage } from '../../../../hooks';
import { useSnackbar } from '../../../../snackbar/context';
import { buildShareHandler } from './share';

interface Props {
  route: Route;
  agency: Agency;
  tripId?: Trip['trip_id'];
}

function useShare(text: string) {
  const toastAlert = useSnackbar();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const callback = useCallback(
    buildShareHandler(text, (err) =>
      toastAlert({
        children: errorMessage(err),
      }),
    ),
    [text, toastAlert],
  );

  if (!import.meta.env.SSR && navigator.share) {
    return callback;
  } else {
    return undefined;
  }
}

export function DetailButtons({ route, agency, tripId }: Props) {
  const handleShare = useShare(route.route_long_name);

  let shareHref = `https://hibus.plus/routes/${route.route_id}`;
  if (tripId) {
    shareHref += `#${tripId}`;
  }

  return (
    <>
      <OutlinedButton
        icon={share}
        iconClass="dark:invert"
        href={shareHref}
        onClick={handleShare}
        id="share"
      >
        Share
      </OutlinedButton>
      <OutlinedButton
        icon={monetization_on}
        iconClass="dark:invert"
        href={agency.agency_fare_url}
      >
        Fare info
      </OutlinedButton>
    </>
  );
}
