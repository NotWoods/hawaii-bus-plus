import { h, Fragment } from 'preact';
import { useContext, useState } from 'preact/hooks';
import type { NearbyWorkerHandler } from '../../worker-nearby/nearby';
import NearbyWorker from '../../worker-nearby/nearby?worker';
import { useApiKey } from '../api/hook';
import { LoginButton } from '../buttons/LoginButton';
import { usePromise } from '../hooks/usePromise';
import { useWorker } from '../hooks/useWorker';
import { MyLocationContext } from '../map/location/context';
import { RouterContext } from '../router/Router';
import { SearchBar } from '../search/SearchBar';
import { emptyClosestResults } from '../search/simple/places-autocomplete';
import { NearbyRoutes } from '../stop/NearbyRoutes';

interface Props {
  onSearch?(): void;
}

export function Title() {
  return (
    <h1 class="font-display font-medium text-2xl uppercase flex items-center">
      <img
        class="h-8 mr-1"
        src="/logo/logo_hawaii.svg"
        alt="Hawaii"
        width="101"
        height="32"
      />
      Bus Plus
      <img
        class="h-4 ml-1 mb-3"
        src="/logo/logo_plus.svg"
        alt="+"
        width="18"
        height="16"
      />
    </h1>
  );
}

export function Home(props: Props) {
  const { point } = useContext(RouterContext);
  const { coords } = useContext(MyLocationContext);
  const [results, setResults] = useState(emptyClosestResults);
  const apiKey = useApiKey();
  const postToNearbyWorker = useWorker(NearbyWorker) as NearbyWorkerHandler;

  usePromise(
    async (signal) => {
      if (!apiKey) return;

      let location: google.maps.LatLngLiteral | undefined;
      if (point && (point.type === 'marker' || point.type === 'user')) {
        location = point.position;
      } else {
        location = coords;
      }

      const results = await postToNearbyWorker(signal, {
        type: 'closest-stop',
        apiKey,
        location,
        fallbackToAll: true,
      });

      setResults(results);
    },
    [apiKey, coords?.lat, coords?.lng, point]
  );

  return (
    <>
      <h2 class="mt-4 font-display font-medium text-xl text-center text-white">
        Aloha kakahiaka
      </h2>
      <LoginButton />
      <SearchBar onClick={props.onSearch} />
      <NearbyRoutes
        class="mt-12 overflow-auto"
        routes={Array.from(results.routes.values())}
        agencies={results.agencies}
      />
    </>
  );
}
