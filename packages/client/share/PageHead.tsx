import { Route } from '@hawaii-bus-plus/types';
import { h } from 'preact';
import { Head, routeTitle } from '../all-pages/components/Head';

interface Props {
  route: Route;
  mapUrl: string;
}

export function PageHead({ route, mapUrl }: Props) {
  const title = routeTitle(route);

  return (
    <Head>
      <title>{title}</title>
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="og:type" content="website" />
      <meta name="twitter:creator" content="@Not_Woods" />
      <meta name="twitter:title" content={title} />
      <meta property="og:title" content={title} />
      <meta property="og:site_name" content="Hawaii Bus Plus" />
      <meta
        name="twitter:description"
        content="Hawaii Bus Plus - Schedule for riding the bus on the Big Island of Hawaii"
      />
      <meta name="twitter:image" content={mapUrl} />
      <meta property="og:image" content={mapUrl} />
      <meta
        property="og:url"
        content={`https://hibus.plus/routes/${route.route_id}`}
      />
      <link
        rel="canonical"
        href={`https://hibus.plus/routes/${route.route_id}`}
      />
    </Head>
  );
}
