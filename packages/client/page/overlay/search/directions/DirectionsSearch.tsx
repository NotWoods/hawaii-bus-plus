import type { Point } from '@hawaii-bus-plus/presentation';
import {
  DirectionsWorker,
  type DirectionsResult,
  type DirectionsWorkerHandler,
} from '@hawaii-bus-plus/workers/directions';
import type { Temporal } from '@js-temporal/polyfill';
import { useRef, useState } from 'preact/hooks';
import { dbInitialized } from '../../../api';
import {
  useDelay,
  useLazyComponent,
  usePromise,
  useWorker,
} from '../../../hooks';
import { LoadingBusIcon } from '../../../loading/LoadingBusIcon';
import { DirectionsTime } from '../../../sheet/directions/DirectionsTime';
import { NOW, timeForWorker } from '../../../time/input/symbol';
import { lazySearchResults } from '../simple/SimpleSearch';
import { emptyResults } from '../simple/places-autocomplete';
import { useAutocompleteKeys } from '../useAutocompleteKeys';
import { DirectionsFields, type FieldsSearchResults } from './DirectionsFields';

interface Props {
  onClose?(): void;
}

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
  const { DirectionsPointResults, DirectionsJourneys } =
    useLazyComponent(lazySearchResults);

  const postToDirectionsWorker = useWorker(
    DirectionsWorker,
  ) as DirectionsWorkerHandler;
  const delayDone = useDelay(300, [depart, arrive, departureTime]);

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
      fathom?.trackGoal('HQEUCTW2', results.journeys.length);
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
      if (results && DirectionsJourneys) {
        return (
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

      {DirectionsPointResults ? (
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
      ) : null}

      {renderJourneys()}
    </>
  );
}
