import { h } from 'preact';
import { useContext, useState } from 'preact/hooks';
import type { NearbyWorkerHandler } from '../../worker-nearby/nearby';
import NearbyWorker from '../../worker-nearby/nearby?worker';
import { databaseInitialized } from '../hooks/useDatabaseInitialized';
import { usePromise } from '../hooks/usePromise';
import { useWorker } from '../hooks/useWorker';
import { MyLocationContext } from '../map/location/context';
import { RouterContext } from '../router/Router';
import { SearchBar } from '../search/SearchBar';
import { SearchBase } from '../search/SearchBase';
import { NearbyRoutes } from '../stop/NearbyRoutes';
import { emptyClosestResults } from '../stop/PlaceCard';
import hawaiiSvg from '../icons/logo_hawaii.svg';
import plusSvg from '../icons/logo_plus.svg';

interface Props {
  onSearch?(): void;
}

function Title() {
  return (
    <h1 class="font-display font-medium text-2xl uppercase flex items-center">
      <img class="h-8 mr-1" src={hawaiiSvg} alt="Hawaii" />
      Bus Plus
      <img class="h-5 ml-1" src={plusSvg} alt="+" />
    </h1>
  );
}

export function Home(props: Props) {
  const { point } = useContext(RouterContext);
  const { coords } = useContext(MyLocationContext);
  const [results, setResults] = useState(emptyClosestResults);
  const postToNearbyWorker = useWorker(NearbyWorker) as NearbyWorkerHandler;

  usePromise(
    async (signal) => {
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
      if (!signal.aborted) {
        setResults(results);
      }
    },
    [coords?.lat, coords?.lng, point]
  );

  return (
    <SearchBase icon={false} iconDisabled logo={<Title />}>
      <h2 class="mt-4 font-display font-medium text-xl text-center text-white">
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
