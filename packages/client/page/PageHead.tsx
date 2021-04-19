import { h } from 'preact';
import { Head } from '../all-pages/components/Head';
import { useSelector } from './router/hooks';
import { selectUrl } from './router/selector/main';
import { RouterState } from './router/state';

function selectCanonical(state: Pick<RouterState, 'main'>) {
  return selectUrl(state, 'https://app.hawaiibusplus.com').href;
}

export function PageHead() {
  const url = useSelector(selectCanonical);

  return (
    <Head>
      <link rel="canonical" href={url} />
    </Head>
  );
}
