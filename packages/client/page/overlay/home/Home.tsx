import type { ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';
import {
  ClosestResults,
  NearbyWorker,
  NearbyWorkerHandler,
} from '@hawaii-bus-plus/workers/nearby';
import { useDelay, usePromise, useWorker } from '../../hooks';
import { dbInitialized } from '../../api';
import { LoadingBusIcon } from '../../loading/LoadingBusIcon';
import { SearchBarButton } from '../search/SearchBar';
import { emptyClosestResults } from '../search/simple/places-autocomplete';
import { NearbyRoutes } from '../stop/NearbyRoutes';
import { Greeting } from './Greeting';
import { useHomeLocation } from './hooks';

interface Props {
  onSearch?(): void;
}

export function Home(props: Props) {
  const [results, setResults] = useState<ClosestResults | undefined>();
  const location = useHomeLocation();
  const delayDone = useDelay(500, [location?.lat, location?.lng]);

  const postToNearbyWorker = useWorker(NearbyWorker) as NearbyWorkerHandler;
  usePromise(
    async (signal) => {
      try {
        await dbInitialized;
      } catch (err: unknown) {
        console.error(err);
        return;
      }

      const results = await postToNearbyWorker(signal, {
        location,
        fallbackToAll: true,
      });

      setResults(results);
    },
    [location?.lat, location?.lng],
  );

  let content: ComponentChildren;
  if (delayDone && !results) {
    content = <LoadingBusIcon />;
  } else {
    const { routes, agencies } = results ?? emptyClosestResults;
    content = (
      <NearbyRoutes
        class="mt-12"
        routes={Array.from(routes.values())}
        agencies={agencies}
        scroll
      />
    );
  }

  return (
    <>
      <Greeting />
      <SearchBarButton onClick={props.onSearch} />
      {content}
    </>
  );
}
