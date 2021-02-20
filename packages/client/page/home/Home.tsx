import { h, Fragment } from 'preact';
import { useContext, useState } from 'preact/hooks';
import type { NearbyWorkerHandler } from '../../worker-nearby/nearby';
import NearbyWorker from '../../worker-nearby/nearby?worker';
import { dbInitialized } from '../api';
import { Button } from '../buttons/Button';
import { usePromise } from '../hooks/usePromise';
import { useWorker } from '../hooks/useWorker';
import loginSvg from '../icons/login.svg';
import { Icon } from '../icons/Icon';
import { MyLocationContext } from '../map/location/context';
import { RouterContext } from '../router/Router';
import { SearchBar } from '../search/SearchBar';
import { emptyClosestResults } from '../search/simple/places-autocomplete';
import { NearbyRoutes } from '../stop/NearbyRoutes';

interface Props {
  onSearch?(): void;
}

export { Title } from '../../all-pages/Title';

function LoginButtons() {
  return (
    <div class="mx-4 mt-8">
      <p class="flex mb-4">
        <Icon
          src={loginSvg}
          alt=""
          class="w-6 h-6 mt-1 mr-2 filter-invert opacity-60"
        />
        You need to have an account to use Hawaii Bus Plus.
      </p>
      <Button href="/auth/login" class="mb-1">
        Login
      </Button>
      <Button href="/auth/register">Create an account</Button>
    </div>
  );
}

export function Home(props: Props) {
  const { point } = useContext(RouterContext);
  const { coords } = useContext(MyLocationContext);
  const [results, setResults] = useState(emptyClosestResults);
  const [authError, setAuthError] = useState(false);
  const postToNearbyWorker = useWorker(NearbyWorker) as NearbyWorkerHandler;

  usePromise(
    async (signal) => {
      try {
        await dbInitialized;
      } catch (err: unknown) {
        console.error('TODO here', err, (err as { code: number }).code);
        setAuthError(true);
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

  return (
    <>
      <h2 class="mt-4 font-display font-medium text-xl text-center text-white">
        Aloha kakahiaka
      </h2>
      <SearchBar onClick={props.onSearch} />
      {authError ? (
        <LoginButtons />
      ) : (
        <NearbyRoutes
          class="mt-12 overflow-auto"
          routes={Array.from(results.routes.values())}
          agencies={results.agencies}
        />
      )}
    </>
  );
}
