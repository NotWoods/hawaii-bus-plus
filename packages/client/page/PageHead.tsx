import { appName, Head, routeTitle } from '../components/Head/Head';
import { useSelector } from './router/hooks';
import { selectRouteDetails, selectUrl } from './router/selector/main';
import type { RouterState } from './router/state';

function selectCanonical(state: Pick<RouterState, 'main'>) {
  return selectUrl(state, 'https://app.hawaiibusplus.com').href;
}

export function PageHead() {
  const url = useSelector(selectCanonical);
  const routeDetails = useSelector(selectRouteDetails);

  return (
    <Head>
      <title>
        {routeDetails
          ? `${routeTitle(routeDetails.route)} - ${appName}`
          : appName}
      </title>
      {import.meta.env.SSR ? null : <link rel="canonical" href={url} />}
    </Head>
  );
}
