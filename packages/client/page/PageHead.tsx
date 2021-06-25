import { h } from 'preact';
import { Head, routeTitle } from '../components/Head/Head';
import { useSelector } from './router/hooks';
import { selectRouteDetails, selectUrl } from './router/selector/main';
import { RouterState } from './router/state';

function selectCanonical(state: Pick<RouterState, 'main'>) {
  return selectUrl(state, 'https://app.hawaiibusplus.com').href;
}

export function PageHead() {
  const url = useSelector(selectCanonical);
  const routeDetails = useSelector(selectRouteDetails);

  return (
    <Head>
      {routeDetails ? <title>{routeTitle(routeDetails.route)}</title> : null}
      <link rel="canonical" href={url} />
    </Head>
  );
}
