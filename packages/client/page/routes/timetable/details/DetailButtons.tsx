import { Agency, Route } from '@hawaii-bus-plus/types';
import { Fragment, h } from 'preact';
import { Button } from '../../../buttons/Button';
import fareIcon from '../../../icons/monetization_on.svg';
import shareIcon from '../../../icons/share.svg';
import webIcon from '../../../icons/web.svg';

interface Props {
  route: Route;
  agency: Agency;
}

export function DetailButtons({ route, agency }: Props) {
  return (
    <>
      <Button
        icon={shareIcon}
        iconClass="dark:filter-invert"
        href={`https://hibus.plus/routes/${route.route_id}`}
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
