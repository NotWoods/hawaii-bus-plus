import { ComponentChildren, Fragment, h } from 'preact';
import { useState } from 'preact/hooks';
import { ClosestResults } from '../../worker-nearby/closest/closest';
import type { NearbyWorkerHandler } from '../../worker-nearby/nearby';
import NearbyWorker from '../../worker-nearby/nearby?worker';
import { LoadingBar } from '../buttons/LoadingBar';
import { useDelay, usePromise, useWorker } from '../hooks';
import { dbInitialized } from '../hooks/api';
import { SearchBar } from '../search/SearchBar';
import { emptyClosestResults } from '../search/simple/places-autocomplete';
import { NearbyRoutes } from '../stop/NearbyRoutes';
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
        type: 'closest-stop',
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
