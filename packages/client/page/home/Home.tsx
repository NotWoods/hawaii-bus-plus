import { ComponentChildren, Fragment, h } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { ClosestResults } from '../../worker-nearby/closest/closest';
import type { NearbyWorkerHandler } from '../../worker-nearby/nearby';
import NearbyWorker from '../../worker-nearby/nearby?worker';
import { LoadingBar } from '../buttons/LoadingBar';
import { useDelay, usePromise, useWorker } from '../hooks';
import { dbInitialized } from '../hooks/api';
import { MyLocationContext } from '../map/location/context';
import { RouterContext } from '../router/Router';
import { SearchBar } from '../search/SearchBar';
import { emptyClosestResults } from '../search/simple/places-autocomplete';
import { NearbyRoutes } from '../stop/NearbyRoutes';
import { BillingButtons, LoginButtons } from './HomeButtons';

interface Props {
  onSearch?(): void;
}

export { Title } from '../../all-pages/Title';

function isAuthError(err: unknown): err is { code: 401 | 402 } {
  const error = err as { code?: unknown };
  return error.code === 401 || error.code === 402;
}

function renderButtons(code: 401 | 402) {
  switch (code) {
    case 401:
      return <LoginButtons />;
    case 402:
      return <BillingButtons />;
  }
}

export function Home(props: Props) {
  const { point } = useContext(RouterContext);
  const { coords } = useContext(MyLocationContext);
  const [results, setResults] = useState<ClosestResults | undefined>();
  const [authError, setAuthError] = useState<401 | 402 | undefined>();
  const delayDone = useDelay(500, [coords?.lat, coords?.lng, point]);

  const postToNearbyWorker = useWorker(NearbyWorker) as NearbyWorkerHandler;
  usePromise(
    async (signal) => {
      try {
        await dbInitialized;
      } catch (err: unknown) {
        if (isAuthError(err)) {
          setAuthError(err.code);
        } else {
          console.error(err);
        }
        return;
      }

      let location: google.maps.LatLngLiteral | undefined;
      if (point && (point.type === 'marker' || point.type === 'user')) {
        location = point.position;
      } else {
        location = coords;
      }

      const results = await postToNearbyWorker(signal, {
        type: 'closest-stop',
        location,
        fallbackToAll: true,
      });

      setResults(results);
    },
    [coords?.lat, coords?.lng, point]
  );

  let content: ComponentChildren;
  if (authError) {
    content = renderButtons(authError);
  } else if (delayDone && !results) {
    content = <LoadingBar />;
  } else {
    const { routes, agencies } = results ?? emptyClosestResults;
    content = (
      <NearbyRoutes
        class="mt-12 overflow-auto"
        routes={Array.from(routes.values())}
        agencies={agencies}
      />
    );
  }

  return (
    <>
      <h2 class="mt-4 font-display font-medium text-xl text-center text-white">
        Aloha kakahiaka
      </h2>
      <SearchBar onClick={props.onSearch} />
      {content}
    </>
  );
}
