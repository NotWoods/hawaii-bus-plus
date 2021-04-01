import { Agency, Route, Trip } from '@hawaii-bus-plus/types';
import { Fragment, h } from 'preact';
import { useCallback } from 'preact/hooks';
import { Button } from '../../../buttons/Button';
import { errorMessage } from '../../../hooks';
import fareIcon from '../../../icons/monetization_on.svg';
import shareIcon from '../../../icons/share.svg';
import webIcon from '../../../icons/web.svg';
import { useSnackbar } from '../../../snackbar/context';

interface Props {
  route: Route;
  agency: Agency;
  tripId?: Trip['trip_id'];
}

export function buildShareHandler(
  text: string,
  onError: (err: unknown) => void
) {
  return function handleShare(evt: MouseEvent) {
    evt.preventDefault();
    const { href } = evt.currentTarget as HTMLAnchorElement;

    navigator
      .share({
        title: 'Route on Hawaii Bus Plus',
        text,
        url: href,
      })
      .catch(onError);
  };
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

  // @ts-expect-error Share feature detection
  if (navigator.share) {
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
