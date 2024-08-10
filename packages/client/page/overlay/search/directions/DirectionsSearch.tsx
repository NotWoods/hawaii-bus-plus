import type { Point } from '@hawaii-bus-plus/presentation';
import {
  DirectionsWorker,
  type DirectionsResult,
  type DirectionsWorkerHandler,
} from '@hawaii-bus-plus/workers/directions';
import type { Temporal } from '@js-temporal/polyfill';
import { lazy, Suspense } from 'preact/compat';
import { useEffect, useRef, useState } from 'preact/hooks';
import { dbInitialized } from '../../../api';
import { useDelay, usePromise, useWorker } from '../../../hooks';
import { LoadingBusIcon } from '../../../loading/LoadingBusIcon';
import {
  SnackbarErrorBoundary,
  SnackbarSuspense,
} from '../../../loading/SnackbarErrorBoundary';
import { DirectionsTime } from '../../../sheet/directions/DirectionsTime';
import { NOW, timeForWorker } from '../../../time/input/symbol';
import { lazySearchResults } from '../simple/SimpleSearch';
import { emptyResults } from '../simple/places-autocomplete';
import { useAutocompleteKeys } from '../useAutocompleteKeys';
import { DirectionsFields, type FieldsSearchResults } from './DirectionsFields';

interface Props {
  onClose?(): void;
}

const DirectionsPointResults = lazy(
  async () => (await lazySearchResults()).DirectionsPointResults,
);
const DirectionsJourneys = lazy(
  async () => (await lazySearchResults()).DirectionsJourneys,
);

export function DirectionsSearch(_props: Props) {
  const [depart, setDepart] = useState<Point | undefined>();
  const [arrive, setArrive] = useState<Point | undefined>();
  const [departureTime, setDepartTime] = useState<
    Temporal.PlainDateTime | string | NOW | undefined
  >();

  const [searchResults, setSearchResults] = useState<FieldsSearchResults>({
    field: 'depart',
    results: emptyResults,
  });
  const [results, setResults] = useState<DirectionsResult | undefined>();

  const postToDirectionsWorker = useWorker(
    DirectionsWorker,
  ) as DirectionsWorkerHandler;
  const delayDone = useDelay(300, [depart, arrive, departureTime]);

  useEffect(() => {
    // prefetch layout
    void lazySearchResults();
  }, []);

  usePromise(
    async (signal) => {
      if (!depart || !arrive) {
        setResults(undefined);
        return;
      }

      await dbInitialized;
      const results = await postToDirectionsWorker(signal, {
        from: depart,
        to: arrive,
        departureTime: timeForWorker(departureTime),
      });

      setResults(results);
      window.fathom?.trackGoal('HQEUCTW2', results.journeys.length);
    },
    [depart, arrive, departureTime],
  );

  const departRef = useRef<HTMLInputElement>(null);
  const arriveRef = useRef<HTMLInputElement>(null);
  function getInputRef() {
    return {
      depart: departRef,
      arrive: arriveRef,
    }[searchResults.field];
  }
  const handleKeyDown = useAutocompleteKeys(getInputRef());

  function renderJourneys() {
    if (depart && arrive) {
      if (results) {
        return (
          <SnackbarErrorBoundary fallback={null}>
            <Suspense fallback={delayDone ? <LoadingBusIcon /> : null}>
              <DirectionsJourneys
                results={results.journeys}
                depart={depart}
                arrive={arrive}
                departureTime={results.depatureTime}
                onTomorrowClick={() => {
                  setResults(undefined);
                  setDepartTime(results.tomorrow);
                }}
              />
            </Suspense>
          </SnackbarErrorBoundary>
        );
      } else if (delayDone) {
        return <LoadingBusIcon />;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  return (
    <>
      <DirectionsFields
        depart={depart}
        arrive={arrive}
        field={searchResults.field}
        departRef={departRef}
        arriveRef={arriveRef}
        setDepart={setDepart}
        setArrive={setArrive}
        onSearchResults={setSearchResults}
        onKeyDown={handleKeyDown}
      />
      <DirectionsTime value={departureTime} onChange={setDepartTime} />

      <SnackbarSuspense fallback={null}>
        <DirectionsPointResults
          {...searchResults}
          onKeyDown={handleKeyDown}
          setDepart={setDepart}
          setArrive={setArrive}
          clearResults={(field) => {
            setSearchResults({
              field,
              results: emptyResults,
            });
          }}
        />
      </SnackbarSuspense>

      {renderJourneys()}
    </>
  );
}
