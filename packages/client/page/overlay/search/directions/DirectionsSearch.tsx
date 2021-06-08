import { Point } from '@hawaii-bus-plus/presentation';
import { Fragment, h } from 'preact';
import { useCallback, useRef, useState } from 'preact/hooks';
import type { Temporal } from 'proposal-temporal';
import type {
  DirectionsResult,
  DirectionsWorkerHandler,
} from '../../../../worker-directions/worker-directions';
import DirectionsWorker from '../../../../worker-directions/worker-directions?worker';
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
import { emptyResults } from '../simple/places-autocomplete';
import { lazySearchResults } from '../simple/SimpleSearch';
import { useAutocompleteKeys } from '../useAutocompleteKeys';
import { DirectionsFields, FieldsSearchResults } from './DirectionsFields';

interface Props {
  onClose?(): void;
}

export function DirectionsSearch(_props: Props) {
  const [depart, setDepart] = useState<Point | undefined>();
  const [arrive, setArrive] = useState<Point | undefined>();
  const [departureTime, setDepartTime] =
    useState<Temporal.PlainDateTime | string | NOW | undefined>();

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
    },
    [depart, arrive, departureTime],
  );

  const departRef = useRef<HTMLInputElement>();
  const arriveRef = useRef<HTMLInputElement>();
  const getInputRef = useCallback(() => {
    return {
      depart: departRef.current,
      arrive: arriveRef.current,
    }[searchResults.field];
  }, [searchResults.field]);
  const handleKeyDown = useAutocompleteKeys(getInputRef);

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
