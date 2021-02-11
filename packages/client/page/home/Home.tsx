import { h } from 'preact';
import { useContext, useState } from 'preact/hooks';
import type { NearbyWorkerHandler } from '../../worker-nearby/nearby';
import NearbyWorker from '../../worker-nearby/nearby?worker';
import { databaseInitialized } from '../hooks/useDatabaseInitialized';
import { usePromise } from '../hooks/usePromise';
import { useWorker } from '../hooks/useWorker';
import { MenuIcon } from '../icons/MenuIcon';
import { MyLocationContext } from '../map/location/context';
import { RouterContext } from '../router/Router';
import { SearchBar } from '../search/SearchBar';
import { SearchBase } from '../search/SearchBase';
import { NearbyRoutes } from '../stop/NearbyRoutes';
import { emptyClosestResults } from '../stop/PlaceCard';

interface Props {
  onSearch?(): void;
}

export function Home(props: Props) {
  const { point } = useContext(RouterContext);
  const { coords } = useContext(MyLocationContext);
  const [results, setResults] = useState(emptyClosestResults);
  const postToNearbyWorker = useWorker(NearbyWorker) as NearbyWorkerHandler;

  usePromise(async () => {
    await databaseInitialized;

    let location: google.maps.LatLngLiteral | undefined;
    if (point && (point.type === 'marker' || point.type === 'user')) {
      location = point.position;
    } else {
      location = coords;
    }

    const results = await postToNearbyWorker({
      type: 'closest-stop',
      location,
      fallbackToAll: true,
    });
    setResults(results);
  }, [coords?.lat, coords?.lng, point]);

  return (
    <SearchBase icon={<MenuIcon />}>
      <h2 class="font-display font-medium text-xl text-center text-white">
        Aloha kakahiaka
      </h2>
      <SearchBar onClick={props.onSearch} />
      <NearbyRoutes
        class="mt-12 overflow-auto"
        routes={Array.from(results.routes.values())}
        agencies={results.agencies}
      />
    </SearchBase>
  );
}
