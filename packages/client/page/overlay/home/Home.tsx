import { ComponentChildren, Fragment, h } from 'preact';
import { useState } from 'preact/hooks';
import type {
  NearbyWorkerHandler,
  ClosestResults,
} from '../../../worker-nearby/worker-nearby';
import NearbyWorker from '../../../worker-nearby/worker-nearby?worker';
import { useDelay, usePromise, useWorker } from '../../hooks';
import { dbInitialized } from '../../api';
import { LoadingBusIcon } from '../../loading/LoadingBusIcon';
import { SearchBarButton } from '../search/SearchBar';
import { emptyClosestResults } from '../search/simple/places-autocomplete';
import { NearbyRoutes } from '../stop/NearbyRoutes';
import { Greeting } from './Greeting';
import { HomeErrorButtons } from './HomeButtons';
import { HomeButtonsError, isHomeButtonsError, useHomeLocation } from './hooks';

interface Props {
  onSearch?(): void;
}

export function Home(props: Props) {
  const [results, setResults] = useState<ClosestResults | undefined>();
  const [error, setError] = useState<HomeButtonsError | undefined>();
  const location = useHomeLocation();
  const delayDone = useDelay(500, [location?.lat, location?.lng]);

  const postToNearbyWorker = useWorker(NearbyWorker) as NearbyWorkerHandler;
  usePromise(
    async (signal) => {
      try {
        await dbInitialized;
      } catch (err: unknown) {
        if (isHomeButtonsError(err)) {
          setError(err);
        } else {
          console.error(err);
        }
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
  if (error) {
    content = <HomeErrorButtons error={error} />;
  } else if (delayDone && !results) {
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
