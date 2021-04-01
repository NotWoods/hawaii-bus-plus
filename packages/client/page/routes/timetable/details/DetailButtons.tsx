import { Agency, Route, Trip } from '@hawaii-bus-plus/types';
import { Fragment, h } from 'preact';
import { useCallback } from 'preact/hooks';
import { Button } from '../../../buttons/Button';
import { errorMessage } from '../../../hooks';
import fareIcon from '../../../icons/monetization_on.svg';
import shareIcon from '../../../icons/share.svg';
import webIcon from '../../../icons/web.svg';
import { useSnackbar } from '../../../snackbar/context';
import { buildShareHandler } from './share';

interface Props {
  route: Route;
  agency: Agency;
  tripId?: Trip['trip_id'];
}

function useShare(text: string) {
  const toastAlert = useSnackbar();
  const callback = useCallback(
    buildShareHandler(text, (err) =>
      toastAlert({
        children: errorMessage(err),
      })
    ),
    [text, toastAlert]
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
      <Button
        icon={shareIcon}
        iconClass="dark:filter-invert"
        href={shareHref}
        onClick={handleShare}
        id="share"
      >
        Share
      </Button>
      <Button
        icon={fareIcon}
        iconClass="dark:filter-invert"
        href={agency.agency_fare_url}
      >
        Fare info
      </Button>
      <Button
        icon={webIcon}
        iconClass="dark:filter-invert"
        href={agency.agency_url}
      >
        Route webpage
      </Button>
    </>
  );
}
