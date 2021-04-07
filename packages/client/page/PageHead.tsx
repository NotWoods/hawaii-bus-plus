import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { Head } from '../all-pages/components/Head';
import { RouterContext } from './router/Router';
import { selectUrl } from './router/selector/main';

export function PageHead() {
  const state = useContext(RouterContext);

  return (
    <Head>
      <link
        rel="canonical"
        href={selectUrl(state, 'https://app.hawaiibusplus.com').href}
      />
    </Head>
  );
}
