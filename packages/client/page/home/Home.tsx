import { h, Fragment } from 'preact';
import { useContext, useState } from 'preact/hooks';
import type { NearbyWorkerHandler } from '../../worker-nearby/nearby';
import NearbyWorker from '../../worker-nearby/nearby?worker';
import { dbInitialized } from '../api';
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

export { Title } from '../../all-pages/Title';

export function Home(props: Props) {
  const { point } = useContext(RouterContext);
  const { coords } = useContext(MyLocationContext);
  const [results, setResults] = useState(emptyClosestResults);
  const postToNearbyWorker = useWorker(NearbyWorker) as NearbyWorkerHandler;

  usePromise(
    async (signal) => {
      let location: google.maps.LatLngLiteral | undefined;
      if (point && (point.type === 'marker' || point.type === 'user')) {
        location = point.position;
      } else {
        location = coords;
      }

      await dbInitialized;
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
      <NearbyRoutes
        class="mt-12 overflow-auto"
        routes={Array.from(results.routes.values())}
        agencies={results.agencies}
      />
    </>
  );
}
